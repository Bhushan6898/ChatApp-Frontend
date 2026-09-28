export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterInput = LoginCredentials & {
  name: string
}

export type AuthUser = {
  name: string
  email: string
}

export type ApiUser = {
  name?: string
  username?: string
  email?: string
}

export type AuthApiData = {
  token?: string
  accessToken?: string
  user?: ApiUser
}

export type AuthApiResponse = AuthApiData & {
  message?: string
  data?: AuthApiData
}

export type UserApiResponse = {
  user?: ApiUser
}

export type AuthSession = {
  accessToken: string | null
  user: AuthUser
}

export type ApiConnectionStatus = 'checking' | 'connected' | 'unavailable'