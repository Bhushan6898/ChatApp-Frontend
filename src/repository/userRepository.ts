import axios, { type AxiosResponse } from 'axios'
import * as authApi from '../api/authApi'
import type { AuthApiResponse, LoginCredentials, RegisterInput, UserApiResponse } from '../types/auth'

function toRepositoryError(error: unknown): Error {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const message = error.response?.data?.message
      ?? (error.response ? error.message : 'Could not reach the authentication server. Check your connection.')
    return new Error(message)
  }

  return error instanceof Error ? error : new Error('Something went wrong. Please try again.')
}

async function getData<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
  try {
    return (await request()).data
  } catch (error) {
    throw toRepositoryError(error)
  }
}

const userRepository = {
  connection: () => getData(() => authApi.checkConnection()),
  getUser: (): Promise<UserApiResponse> => getData(() => authApi.getUser()),
  login: (credentials: LoginCredentials): Promise<AuthApiResponse> =>
    getData(() => authApi.login(credentials)),
  registration: (input: RegisterInput): Promise<AuthApiResponse> =>
    getData(() => authApi.register(input)),
  logout: () => getData(() => authApi.logout()),
}

export default userRepository