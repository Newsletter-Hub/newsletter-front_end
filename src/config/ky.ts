import ky from 'ky';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const publicApi = ky.create({
  prefixUrl: baseUrl,
  credentials: 'include',
});

const api = ky.create({ prefixUrl: baseUrl });

export default api;
