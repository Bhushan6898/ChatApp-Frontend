import * as authApi from '../api/authApi'
import type { AuthSession, LoginCredentials, RegisterInput } from '../types/auth'

function createSession(response: Awaited<ReturnType<typeof authApi.login>>): AuthSession {
  return {
    accessToken: response.token,
    user: response.user,
  }
}

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return createSession(await authApi.login(credentials))
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    return createSession(await authApi.register(input))
  },
}