import api from '../api/axios';

import { clearToken } from '../utils/tokenHelper';

const AuthService = {
  login: (username, password) =>
    api.post('/authentication/login', { username, password }).then(r => r.data),

  logout: () => {
    clearToken();
    localStorage.removeItem("adminName");
    window.location.href = "/login";  // hard redirect to login
  }
};

export default AuthService;

