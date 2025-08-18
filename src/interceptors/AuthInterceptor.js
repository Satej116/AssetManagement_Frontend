import api from '../api/axios';

export const setupAuthInterceptor = (onUnauthorized) => {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        onUnauthorized?.();
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
};
