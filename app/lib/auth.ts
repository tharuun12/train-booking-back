import { jwtVerify } from 'jose';

export async function getUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload;
  } catch (error) {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/signin';
}