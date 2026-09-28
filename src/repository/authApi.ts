export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type AuthSession = {
  token: string
  user: {
    name: string
    email: string
  }
}

type LoginPayload = Pick<RegisterPayload, 'email' | 'password'>

const apiBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function postAuth<TPayload>(path: string, payload: TPayload): Promise<AuthSession> {
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

export function loginUser(payload: LoginPayload): Promise<AuthSession> {
  return postAuth('login', payload)
}

export function registerUser(payload: RegisterPayload): Promise<AuthSession> {
  return postAuth('register', payload)
}