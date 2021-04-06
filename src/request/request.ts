import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: '/api',
})

request.interceptors.request.use((config: AxiosRequestConfig) => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})

request.interceptors.response.use(
  // 成功回调
  (response: AxiosResponse) => {
    store.commit('setLoading', false)
    if (!response.data.code) {
      return response.data.data
    } else {
      return Promise.reject(response.data)
    }
  },
  // 失败回调
  ({ response: { data } }) => {
    const { code, detail = [], error } = data

    console.info('error code: ', code)
    console.info('error message: ', error)
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    detail.forEach(({ field, message }: { field: string; message: string }) => {
      console.log(`=> ${field}: ${message}`)
    })

    return Promise.reject(error)
  }
)

export default request
