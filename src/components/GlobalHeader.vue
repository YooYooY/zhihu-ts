<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">cvl专栏</router-link>
    <ul class="list-line mb-0" v-if="!user.isLogin">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul class="list-line mb-0" v-else>
      <li class="list-inline-item">
        <Dropdown :title="`hi! ${user.nickName}`">
          <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem>
          <DropdownItem  :disabled="user.column ? false : true"><router-link :to="`/column/${user.column}`"  class="dropdown-item">我的专栏</router-link></DropdownItem>
          <DropdownItem disabled><router-link to="/" class="dropdown-item">编辑资料</router-link></DropdownItem>
          <DropdownItem><a @click="$store.commit('logout')" class="dropdown-item">退出登录</a></DropdownItem>
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { UserProps } from "@/typings";
import { defineComponent, PropType } from "vue"
import Dropdown from "./Dropdown.vue"
import DropdownItem from "./DropdownItem.vue"

export default defineComponent({
  name: "GlobalHeader",
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  }
})
</script>
