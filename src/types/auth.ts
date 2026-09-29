export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterInput = LoginCredentials & {
  name: string
}

export type AuthUser = {
  id: string | null
  name: string
  email: string
  avatar: string
}

export type ApiUser = {
  _id?: string
  id?: string
  name?: string
  username?: string
  email?: string
  avatar?: string
}

export type AuthApiData = {
  token?: string
  accessToken?: string
  user?: ApiUser
}

export type AuthApiResponse = AuthApiData & ApiUser & {
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