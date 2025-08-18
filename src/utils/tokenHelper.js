import { jwtDecode } from 'jwt-decode';
import { User } from '../models/User';


export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

export const parseUser = (token) => {
  try {
    const d = jwtDecode(token);
    return new User({
      employeeId: d.EmployeeId || d.employeeId,
      username: d.sub || d.username,
      role: d.Role || d.role
    });
  } catch {
    return null;
  }
};
