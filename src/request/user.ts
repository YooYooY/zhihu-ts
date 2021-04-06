import request from './request'

export function getUserCurrent<T>(): Promise<T> {
  return request.get<T, T>('/user/current')
}

export function signupUser(
  params: Record<'email' | 'nickName' | 'password', string> & {
    repreatPassword?: string
  }
) {
  return request.post('/users', params)
}

export function login<T>(payload: T) {
  return request.post<T, T>('/user/login', payload)
}
