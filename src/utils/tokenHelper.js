import { jwtDecode } from 'jwt-decode';
import { User } from '../models/User';

export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

export const parseUser = (token) => {
  try {
    const d = jwtDecode(token);
    console.log("Raw decoded token payload:", d); // ✅ debug log

    return new User({
      employeeId: d.EmployeeId || d.employeeId,
      username: d.unique_name || d.sub || d.username, // ✅ add unique_name
      role: d.role || d.Role                          // ✅ lowercase first
    });
  } catch {
    return null;
  }
};
