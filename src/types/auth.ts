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

export type AuthSession = {
  accessToken: string
  user: AuthUser
}