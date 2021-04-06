import {
  getUserCurrent,
  login,
  getColumn,
  getColumns,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  createPost,
} from '@/request'
import request from '@/request/request'
import { GlobalDataProps, GlobalErrorProps, PostProps } from '@/typings'
import { arrToObj, objToArr } from '@/utils'
import { createStore } from 'vuex'

export default createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    user: { isLogin: false },
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    error: {
      status: false,
    },
  },
  mutations: {
    fetchCurrentUser(state, data) {
      state.user = { isLogin: true, ...data }
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1,
      }
    },
    fetchColumn(state, data) {
      state.columns.data[data._id] = data
    },
    fetchPosts(state, { data, cid }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(data.list) }
      state.posts.loadedColumns.push(cid)
    },
    fetchPost(state, data) {
      state.posts.data[data._id] = data
    },
    deletePost(state, data) {
      delete state.posts.data[data._id]
      state.posts.loadedColumns = state.posts.loadedColumns.filter(
        (id) => id !== data._id
      )
    },
    updatePost(state, data) {
      state.posts.data[data._id] = data
    },
    createPost(state, newPost) {
      let posts = Object.values(state.posts.data);
      posts.unshift(newPost);
      state.posts.data = arrToObj(posts);
    },
    login(state, token) {
      state.token = token
      localStorage.setItem('token', token)
      request.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete request.defaults.headers.common.Authorization
    },
  },
  actions: {
    async fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        const rawData = await getColumns(currentPage, pageSize)
        commit('fetchColumns', rawData)
      }
    },
    async fetchColumn({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        const data = await getColumn(cid)
        commit('fetchColumn', data)
      }
    },
    async fetchPosts({ state, commit }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        const data = await getPosts(cid)
        commit('fetchPosts', { data, cid })
      }
    },
    async fetchPost({ state, commit }, id) {
      let data = state.posts.data[id] as PostProps
      if (!data || !data.content) {
        data = await getPost<PostProps>(id)
        commit('fetchPost', data)
        return data
      } else {
        return Promise.resolve<PostProps>(data)
      }
    },
    async updatePost({ commit }, { id, payload }) {
      payload = await updatePost(id, payload)
      commit('updatePost', payload)
      return payload
    },
    async createPost({ commit }, payload) {
      const newPost = await createPost(payload)
      commit('createPost', newPost)
      return newPost
    },
    async deletePost({ commit }, id) {
      const data = await deletePost(id)
      commit('deletePost', data)
      return data
    },
    async fetchCurrentUser({ commit }) {
      const data = await getUserCurrent()
      commit('fetchCurrentUser', data)
    },
    async login({ commit }, payload) {
      const { token } = await login(payload)
      commit('login', token)
      return token
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() =>
        dispatch('fetchCurrentUser')
      )
    },
  },
  getters: {
    columns: (state) => objToArr(state.columns.data),
    getColumnById: (state) => (id: string) => state.columns.data[id],
    getPostsByCid: (state) => (cid: string) =>
      objToArr(state.posts.data).filter((post) => post.column === cid),
    getCurrentPost: (state) => (id: string) => state.posts.data[id],
  },
})
