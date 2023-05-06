import ky from 'ky';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const api = ky.create({
  prefixUrl: baseUrl,
  credentials: 'include',
});

export default api;
