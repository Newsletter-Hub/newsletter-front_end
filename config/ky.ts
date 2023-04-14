import ky from 'ky'

const baseUrl = 'http://apis.somecourseurl.com/api/'

export const api = ky.create({ prefixUrl: baseUrl })

export default api
