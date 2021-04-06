import { ColumnProps, ImageProps, UserProps } from '@/typings'

export const delay = <T>(ms: number): Promise<T> =>
  new Promise((r) => setTimeout(r, ms))

interface Defer {
  (): {
    resolve: () => void
    reject: () => void
    promise: Promise<void>
  }
  <T>(): {
    resolve: (val: T) => void
    reject: (val: T) => void
    promise: Promise<T>
  }
}

export const defer: Defer = () => {
  const dfd = {} as any
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}

export const generateFitUrl = (
  data: ImageProps,
  width: number,
  height: number,
  format = ['m_pad']
) => {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => current + ',' + prev, '')
    const paramStr = `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
    data.fitUrl = data.url + paramStr
  }
}

export const addColumnAvatar = (
  data: UserProps | ColumnProps,
  width: number,
  height: number
) => {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title
        ? '@/assets/column.jpg'
        : '@/assets/avatar.jpg'),
    }
  }
}

export const arrToObj = <T extends { _id?: string }>(arr: T[]) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })
}

export const objToArr = <T>(obj: { [key: string]: T }) => Object.values(obj)

interface CheckCondition {
  format?: string[]
  size?: number
}

type ErrorType = 'size' | 'format' | null

export const beforeUploadCheck = (file: File, condition: CheckCondition) => {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 2024 < size : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}
