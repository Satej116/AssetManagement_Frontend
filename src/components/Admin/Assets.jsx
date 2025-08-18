import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'react-bootstrap';
import AssetService from '../../services/AssetService';
import Loader from '../common/Loader';

export default function Assets(){
  const { data, isLoading, error } = useQuery(['assets'], () => AssetService.list());
  if (isLoading) return <Loader />;
  if (error) return <div>Error loading assets</div>;

  // backend may return array or { items: [...] }
  const rows = Array.isArray(data) ? data : (data?.items ?? []);

  return (
    <>
      <h5 className="mb-3">Assets</h5>
      <Table striped bordered hover>
        <thead>
          <tr><th>ID</th><th>Asset No</th><th>Name</th><th>Category</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map(a => (
            <tr key={a.assetId}>
              <td>{a.assetId}</td>
              <td>{a.assetNo}</td>
              <td>{a.assetName}</td>
              <td>{a.categoryName ?? a.category?.categoryName}</td>
              <td>{a.statusName ?? a.status?.statusName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
