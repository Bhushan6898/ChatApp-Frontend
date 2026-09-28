import type { LoginCredentials, RegisterInput } from '../types/auth'

type AuthApiResponse = {
  token: string
  user: {
    name: string
    email: string
  }
}

const apiBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function postAuth<TPayload>(path: string, payload: TPayload): Promise<AuthApiResponse> {
  if (!apiBaseUrl) {
    throw new Error('Authentication API is not configured. Set VITE_API_URL and restart the app.')
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Could not reach the authentication server. Check the API URL and try again.')
  }

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = isRecord(body) && typeof body.message === 'string'
      ? body.message
      : `Authentication failed (${response.status}).`
    throw new Error(message)
  }

  if (!isRecord(body) || typeof body.token !== 'string' || !isRecord(body.user)
    || typeof body.user.name !== 'string' || typeof body.user.email !== 'string') {
    throw new Error('The authentication server returned an invalid response.')
  }

  return {
    token: body.token,
    user: { name: body.user.name, email: body.user.email },
  }
}

export function login(credentials: LoginCredentials): Promise<AuthApiResponse> {
  return postAuth('login', credentials)
}

export function register(input: RegisterInput): Promise<AuthApiResponse> {
  return postAuth('register', input)
}