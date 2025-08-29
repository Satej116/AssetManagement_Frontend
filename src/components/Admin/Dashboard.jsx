import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import AssetService from '../../services/AssetService';
import ServiceRequestService from '../../services/ServiceRequestService';
import AdminLogService from '../../services/AdminLogService';
import CountUp from "react-countup";
import { format, formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [totalAssets, setTotalAssets] = useState(0);
  const [allocatedAssets, setAllocatedAssets] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [ongoingAudits, setOngoingAudits] = useState(0); // optional

  const [byCategoryRaw, setByCategoryRaw] = useState([]);
  const [monthlyRaw, setMonthlyRaw] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const formatDate = (ts) => format(new Date(ts), "dd MMM yyyy, hh:mm a");

  // Normalize API → chart-ready formats
  const assetDistribution = useMemo(() => {
    return (byCategoryRaw || []).map((x, i) => ({
      name: x.categoryName ?? x.CategoryName ?? `Category ${x.categoryId ?? x.CategoryId ?? i + 1}`,
      value: x.count ?? x.Count ?? 0,
    }));
  }, [byCategoryRaw]);

  const requestsTrend = useMemo(() => {
    const parsed = (monthlyRaw || [])
      .filter(x => x.month || x.Month)
      .map(x => {
        const monthStr = x.month ?? x.Month ?? '';
        let label = monthStr;
        const m = monthStr.match(/^(\d{4})-(\d{2})$/);
        if (m) {
          const y = m[1], mm = Number(m[2]);
          const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          label = `${names[mm-1]} ${y}`;
        }
        return { month: label, requests: x.count ?? x.Count ?? 0 };
      });
    return parsed;
  }, [monthlyRaw]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    Promise.all([
      AssetService.getAll(),                // total assets
      AssetService.getAllocatedCount(),     // allocated count
      AssetService.getByCategory(),         // pie data
      ServiceRequestService.getPendingCount(), // pending count
      ServiceRequestService.getMonthlyRequests(),   // monthly trend
      AdminLogService.getRecent(10),        // recent activity
    ])
      .then(([allRes, allocRes, catRes, pendRes, monthlyRes, recentRes]) => {
        if (!mounted) return;

        setTotalAssets(Array.isArray(allRes) ? allRes.length : Number(allRes?.total ?? 0));
        setAllocatedAssets(Number(allocRes ?? 0));
        setByCategoryRaw(Array.isArray(catRes) ? catRes : []);
        setPendingRequests(Number(pendRes ?? 0));
        setMonthlyRaw(Array.isArray(monthlyRes) ? monthlyRes : []);
        setRecentActivity(Array.isArray(recentRes) ? recentRes : []);
      })
      .catch(e => {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e.message || 'Failed to load dashboard data');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#00B8A9'];

  return (
    <Container fluid className="mt-3">
      {err && <Alert variant="danger" className="mb-3">{err}</Alert>}

      {/* KPI CARDS */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card bg="primary" text="white" className="text-center shadow">
            <Card.Body>
              <Card.Title>Total Assets</Card.Title>
              <h3>{loading ? <Spinner size="sm" /> : <CountUp end={totalAssets} duration={1.5} />}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card bg="success" text="white" className="text-center shadow">
            <Card.Body>
              <Card.Title>Allocated</Card.Title>
              <h3>{loading ? <Spinner size="sm" /> : <CountUp end={allocatedAssets} duration={1.5} />}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card bg="warning" text="dark" className="text-center shadow">
            <Card.Body>
              <Card.Title>Pending Requests</Card.Title>
              <h3>{loading ? <Spinner size="sm" /> : <CountUp end={pendingRequests} duration={1.5} />}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card bg="danger" text="white" className="text-center shadow">
            <Card.Body>
              <Card.Title>Ongoing Audits</Card.Title>
              <h3>{loading ? <Spinner size="sm" /> : <CountUp end={ongoingAudits} duration={1.5} />}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CHARTS */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Assets by Category</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((c, i) => (
                      <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={assetDistribution}
                    cx="50%" cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label
                  >
                    {assetDistribution.map((_, idx) => (
                      <Cell key={idx} fill={`url(#grad${idx})`} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Monthly Service Requests</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestsTrend}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="url(#barGradient)">
                    {requestsTrend.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* RECENT ACTIVITY */}
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Recent Admin Activity</Card.Title>
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Description</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.length === 0 && (
                      <tr><td colSpan={5} className="text-center">
                        {loading ? 'Loading…' : 'No recent logs'}
                      </td></tr>
                    )}
                    
                    {recentActivity.map((r, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          {(() => {
                            const action = r.action ?? r.Action;
                            if (action?.toLowerCase().includes('create')) 
                              return <Badge bg="success">{action}</Badge>;
                            if (action?.toLowerCase().includes('delete')) 
                              return <Badge bg="danger">{action}</Badge>;
                            if (action?.toLowerCase().includes('update')) 
                              return <Badge bg="warning" text="dark">{action}</Badge>;
                            return <Badge bg="secondary">{action}</Badge>;
                          })()}
                        </td>
                        <td>{r.entityAffected ?? r.EntityAffected}</td>
                        <td>{r.description ?? r.Description}</td>
                        <td>
                          {formatDate(r.timestamp ?? r.Timestamp)} 
                          <small className="text-muted">
                            ({formatDistanceToNow(new Date(r.timestamp ?? r.Timestamp), { addSuffix: true })})
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
