import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/AuthService';
import { setToken, parseUser, getToken } from '../../utils/tokenHelper';
import { setupAuthInterceptor } from '../../interceptors/AuthInterceptor';

const schema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required')
});

export default function Login() {
  const [error, setError] = useState(null);

  useEffect(() => {
    // If already logged in, redirect immediately
    const t = getToken();
    if (t) {
      const u = parseUser(t);
      if (u?.role === 'Admin') window.location.href = '/admin';
      else if (u?.role === 'Employee') window.location.href = '/employee';
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const data = await AuthService.login(values.username, values.password);

      // token might come as {token}, {accessToken}, or raw string
      const jwt = data?.token || data?.accessToken || (typeof data === 'string' ? data : null);
      if (!jwt) throw new Error('Token missing in response');

      // save token
      setToken(jwt);
      setupAuthInterceptor(() => setToken(null));

      // decode user
      const u = parseUser(jwt);

      // redirect by role
      if (u?.role === 'Admin') window.location.href = '/admin';
      else if (u?.role === 'Employee') window.location.href = '/employee';
      else window.location.href = '/login'; // fallback
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: 420 }}>
        <Card.Body>
          <h4 className="mb-3">Sign in</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Formik initialValues={{ username: '', password: '' }} validationSchema={schema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <Field name="username" className="form-control" />
                  <div className="text-danger"><ErrorMessage name="username" /></div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <Field type="password" name="password" className="form-control" />
                  <div className="text-danger"><ErrorMessage name="password" /></div>
                </div>
                <Button type="submit" disabled={isSubmitting}>Login</Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
}
