import userRepository from './userRepository'
import type { AuthApiResponse, AuthSession, LoginCredentials, RegisterInput } from '../types/auth'

function createSession(response: AuthApiResponse, fallbackEmail: string): AuthSession {
  const apiUser = response.user ?? response.data?.user ?? response
  const email = apiUser?.email ?? fallbackEmail

  return {
    accessToken: response.accessToken ?? response.token ?? response.data?.accessToken ?? response.data?.token ?? null,
    user: {
      id: apiUser?._id ?? apiUser?.id ?? null,
      name: apiUser?.name ?? apiUser?.username ?? email.split('@')[0],
      email,
      avatar: apiUser?.avatar ?? '',
    },
  }
}

export const authRepository = {
  async checkConnection(): Promise<unknown> {
    return userRepository.connection()
  },

  async restore(): Promise<AuthSession> {
    const response = await userRepository.getUser()
    if (!response.user) throw new Error('Could not restore the signed-in user.')

    return createSession({ user: response.user }, response.user.email ?? 'user@example.com')
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return createSession(await userRepository.login(credentials), credentials.email)
  },

  async register(input: RegisterInput): Promise<void> {
    await userRepository.registration(input)
  },

  async logout(): Promise<void> {
    await userRepository.logout()
  },
}