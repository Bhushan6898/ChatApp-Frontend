import axios, { type AxiosResponse } from 'axios'
import * as authApi from '../api/authApi'
import type { AuthApiResponse, LoginCredentials, RegisterInput, UserApiResponse } from '../types/auth'

function toRepositoryError(error: unknown): Error {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    const responseMessage = error.response?.data?.message
    if (responseMessage?.trim()) return new Error(responseMessage)

    const status = error.response?.status
    if (!status) return new Error('Unable to connect. Check your internet connection and try again.')
    if (status === 400 || status === 422) return new Error('Please check the information you entered and try again.')
    if (status === 401) return new Error('Email or password is incorrect.')
    if (status === 403) return new Error('You are not allowed to do that.')
    if (status === 404) return new Error('The requested service could not be found.')
    if (status === 409) return new Error('An account with this email already exists.')
    if (status === 429) return new Error('Too many attempts. Please wait a moment and try again.')
    if (status >= 500) return new Error('The service is temporarily unavailable. Please try again shortly.')
    return new Error('Your request could not be completed. Please try again.')
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