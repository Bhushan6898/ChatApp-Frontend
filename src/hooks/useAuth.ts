import { useEffect, useState } from 'react'
import { authRepository } from '../repository/authRepository'
import type { ApiConnectionStatus, AuthSession, LoginCredentials, RegisterInput } from '../types/auth'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [apiConnectionStatus, setApiConnectionStatus] = useState<ApiConnectionStatus>('checking')
  const [apiConnectionResponse, setApiConnectionResponse] = useState<unknown>(null)

  useEffect(() => {
    let active = true

    authRepository.checkConnection()
      .then((response) => {
        if (active) {
          setApiConnectionStatus('connected')
          setApiConnectionResponse(response)
        }
      })
      .catch(() => {
        if (active) setApiConnectionStatus('unavailable')
      })

    authRepository.restore()
      .then((restoredSession) => {
        if (active) setSession(restoredSession)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsCheckingSession(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function login(credentials: LoginCredentials) {
    const nextSession = await authRepository.login(credentials)
    setSession(nextSession)
  }

  async function register(input: RegisterInput) {
     await authRepository.register(input)
    window.location.hash = '#/login'
  }

  async function logout() {
    try {
      await authRepository.logout()
    } finally {
      setSession(null)
    }
  }

  return { session, isCheckingSession, apiConnectionStatus, apiConnectionResponse, login, register, logout }
}