import request from './request'

export function getPosts(cid: string) {  
  return request.get(`/columns/${cid}/posts`)
}

export function getPost<T>(id: string) {
  return request.get<T,T>(`/posts/${id}`)
}

export function updatePost<T>(id: string, data: T) {
  return request.patch<T, T>(`/posts/${id}`, data)
}

export function createPost<T>(data: T) {
  return request.post('/posts', data)
}

export function deletePost(id: string) {
  return request.delete(`/posts/${id}`)
}
