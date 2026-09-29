import type { AuthSession } from '../types/auth'

const storageKey = 'chatapplication.auth-session'
const sessionDurationMs = 24 * 60 * 60 * 1000

type StoredAuthSession = {
  session: AuthSession
  expiresAt: number
}

export function readStoredAuthSession(): AuthSession | null {
  try {
    const storedValue = localStorage.getItem(storageKey)
    if (!storedValue) return null

    const storedSession = JSON.parse(storedValue) as StoredAuthSession
    if (storedSession.expiresAt <= Date.now() || !storedSession.session?.user?.email) {
      localStorage.removeItem(storageKey)
      return null
    }

    return storedSession.session
  } catch {
    return null
  }
}

export function saveAuthSession(session: AuthSession): void {
  try {
    const storedSession: StoredAuthSession = {
      session,
      expiresAt: Date.now() + sessionDurationMs,
    }
    localStorage.setItem(storageKey, JSON.stringify(storedSession))
  } catch {
    // The in-memory session still works when browser storage is unavailable.
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // Ignore storage failures while signing out.
  }
}