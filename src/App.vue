<template>
  <global-header :user="currentUser"></global-header>
  <Loader v-if="isLoading"></Loader>
  <main>
    <router-view></router-view>
  </main>
  <footer class="text-center py-4 text-secondary bg-light mt-6">
    <small>
      <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2021 cc专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue"
import GlobalHeader from "@/components/GlobalHeader.vue"
import { useStore } from "vuex";
import { GlobalDataProps } from "./typings";
import notice from "@/components/message";
import Loader from "@/components/Loader.vue"

export default defineComponent({
  name: "App",
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const currentUser = computed(()=>store.state.user);
    const isLoading = computed(()=>store.state.loading);
    const error = computed(()=>store.state.error);
    
    watch(()=>error.value.status,()=>{
      const {status,message} = error.value;
      if(status && message){
        notice.error(message)
      }
    })
    
    return {
      currentUser,
      isLoading,
      error
    }
    
  }
})
</script>

<style scoped>
main{
    min-height: calc(100vh - 163px);
}
</style>
