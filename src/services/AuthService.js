import api from '../api/axios';

const AuthService = {
  login: (username, password) =>
    api.post('/authentication/login', { username, password }).then(r => r.data),
  logout: () => localStorage.removeItem('token')
};

export default AuthService;
