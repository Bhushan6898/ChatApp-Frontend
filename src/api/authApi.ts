import type { AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'
import type { AuthApiResponse, LoginCredentials, RegisterInput, UserApiResponse } from '../types/auth'

export function checkConnection(): Promise<AxiosResponse<unknown>> {
  return axiosInstance.get('/api/connection')
}

export function getUser(): Promise<AxiosResponse<UserApiResponse>> {
  return axiosInstance.get('/api/users/getuser')
}

export function login(credentials: LoginCredentials): Promise<AxiosResponse<AuthApiResponse>> {
  return axiosInstance.post('/api/user/login', credentials)
}

export function register(input: RegisterInput): Promise<AxiosResponse<AuthApiResponse>> {
  return axiosInstance.post('/api/user/register', input)
}

export function logout(): Promise<AxiosResponse<unknown>> {
  return axiosInstance.post('/api/users/logout')
}