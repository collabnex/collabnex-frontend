import api from '../../global/services/apiClient';

// signup
export async function registerUser({ fullName, email, password }) {
  const payload = { fullName, email, password };
  const res = await api.post('/auth/register', payload);
  return res.data;
}

// login
export async function loginUser({ email, password }) {
  const payload = { email, password };
  const res = await api.post('/auth/login', payload);
  return res.data; // should contain token, user info
}
