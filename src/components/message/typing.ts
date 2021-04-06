export type AniCls = 'fade-in' | 'fade-out'

export type MessageType = 'primary' | 'success' | 'danger' | 'warning' | 'error'

export interface MessageOptions {
  type: MessageType
  message: string
  duration?: number
  callback?: (...args: any[]) => void
}
