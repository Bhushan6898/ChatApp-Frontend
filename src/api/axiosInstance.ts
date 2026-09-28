import axios from 'axios'

const configuredBaseURL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  || 'http://localhost:3001'

export const BaseURL = import.meta.env.DEV ? '' : configuredBaseURL

const axiosInstance = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default axiosInstance