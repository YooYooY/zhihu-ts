export interface ResponseType<P = {}> {
  code: number
  msg: string
  data: P
}

export type ImageProps = Partial<
  Record<'_id' | 'url' | 'createAt' | 'fitUrl', string>
>

export type UserProps = Partial<{
  _id: string
  email: string
  nickName: string
  avatar: ImageProps
  column: string
  description: string
}> & { isLogin: boolean }

export interface GlobalErrorProps {
  status: boolean
  message?: string
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface PostProps {
  _id?: string
  title: string
  excerpt?: string
  content?: string
  image?: ImageProps | string
  createdAt?: string
  column: string
  author?: string | UserProps
  isHTML?: boolean
}

interface ListProps<P> {
  [id: string]: P
}

export interface GlobalDataProps {
  token: string
  user: UserProps
  loading: boolean
  columns: {
    data: ListProps<ColumnProps>
    currentPage: number
    total: number
  }
  posts: {
    data: ListProps<PostProps>
    loadedColumns: string[]
  }
  error: GlobalErrorProps
}
