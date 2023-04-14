import ky from 'ky';

const baseUrl = 'http://apis.somecourseurl.com/api/';

export const publicApi = ky.create({ prefixUrl: baseUrl });

const api = ky.create({ prefixUrl: baseUrl });

export default api;
