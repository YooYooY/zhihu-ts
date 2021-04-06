import { createApp } from 'vue'
import Message from './Message.vue'
import { MessageOptions, MessageType } from './typing'
import { defer } from '@/utils'

type TypeMethod = {
  [type in MessageType]: (
    message: string,
    duration?: number,
    options?: Omit<MessageOptions, 'type' | 'message'>
  ) => any
}

interface MessageMethod extends TypeMethod {
  (options: MessageOptions): any
}

function createMessage(options: MessageOptions) {
  const { type = 'default', message = '', duration = 2000, callback } = options
  const dfd = defer()
  const app = createApp(Message, {
    options: { type, message, duration },
  })
  const el = document.createElement('div')
  document.body.appendChild(el)
  const incs = app.mount(el) as any

  incs.show().then(() => {
    setTimeout(async () => {
      await incs.close()
      app.unmount()
      document.body.removeChild(el)
      callback && callback()
      dfd.resolve()
    }, duration)
  })

  return dfd.promise
}

const messageTypes: MessageType[] = [
  'success',
  'danger',
  'warning',
  'primary',
  'error',
]

const messageMth = messageTypes.reduce((pre, type) => {
  pre[type] = (
    message: string,
    duration?: number,
    options?: Omit<MessageOptions, 'type' | 'message'>
  ) => createMessage({ type, message, duration, ...(options || {}) })
  return pre
}, {} as { [key: string]: any })

function initMessage(): MessageMethod {
  const result = Object.assign(createMessage, messageMth)
  return result as MessageMethod
}

const message = initMessage()

export default message
