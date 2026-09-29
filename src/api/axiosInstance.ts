import axios from 'axios'
import { readStoredAuthSession } from '../repository/authSessionStorage'

const configuredBaseURL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
  || 'https://chatapp-backend-6zgm.onrender.com/'

export const BaseURL = import.meta.env.DEV ? '' : configuredBaseURL

const axiosInstance = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = readStoredAuthSession()?.accessToken
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`)
  return config
})

export default axiosInstance