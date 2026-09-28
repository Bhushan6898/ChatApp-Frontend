import { useState } from 'react'
import { authRepository } from '../repository/authRepository'
import type { AuthSession, LoginCredentials, RegisterInput } from '../types/auth'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)

  async function login(credentials: LoginCredentials) {
    const nextSession = await authRepository.login(credentials)
    setSession(nextSession)
  }

  async function register(input: RegisterInput) {
    const nextSession = await authRepository.register(input)
    setSession(nextSession)
  }

  function logout() {
    setSession(null)
  }

  return { session, login, register, logout }
}