import request from '@/request/request'
import store from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      redirectAlreadyLogin: true,
    },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () =>
      import(/* webpackChunkName: "Signup" */ '../views/Signup.vue'),
    meta: {
      redirectAlreadyLogin: true,
    },
  },
  {
    path: '/create',
    name: 'create',
    component: () =>
      import(/* webpackChunkName: "create" */ '../views/CreatePost.vue'),
    meta: {
      requiredLogin: true,
    },
  },
  {
    path: '/column/:id',
    name: 'column',
    component: () =>
      import(/* webpackChunkName: "column" */ '../views/ColumnDetail.vue'),
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: () =>
      import(/* webpackChunkName: "post" */ '../views/PostDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta;
  
  if(!user.isLogin){
    
    if(token){
      request.defaults.headers.common.Authorization = `Bearer ${token}`;
      store.dispatch("fetchCurrentUser").then(()=>{
        if(redirectAlreadyLogin){
          next("/")
        }else{
          next();
        }
      }).catch(e=>{
        store.commit("logout");
        next("login")
      })
    }else{
      if(requiredLogin){
        next("login")
      }else{
        next();
      }
    }
    
  }else{
    if(redirectAlreadyLogin){
      next("/")
    }else{
      next()
    }
  }
  
})

export default router
