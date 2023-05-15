import ky from 'ky';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const isServer = typeof window === 'undefined';

export const api = ky.create({
  prefixUrl: isServer ? `${baseUrl}/api/` : '/api/',
});
export default api;
