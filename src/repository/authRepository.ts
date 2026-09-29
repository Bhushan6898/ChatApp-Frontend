import userRepository from './userRepository'
import { clearAuthSession, readStoredAuthSession, saveAuthSession } from './authSessionStorage'
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
    const storedSession = readStoredAuthSession()
    if (storedSession) return storedSession

    const response = await userRepository.getUser()
    if (!response.user) throw new Error('Could not restore the signed-in user.')

    const restoredSession = createSession({ user: response.user }, response.user.email ?? 'user@example.com')
    saveAuthSession(restoredSession)
    return restoredSession
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = createSession(await userRepository.login(credentials), credentials.email)
    saveAuthSession(session)
    return session
  },

  async register(input: RegisterInput): Promise<void> {
    await userRepository.registration(input)
  },

  async logout(): Promise<void> {
    try {
      await userRepository.logout()
    } finally {
      clearAuthSession()
    }
  },
}