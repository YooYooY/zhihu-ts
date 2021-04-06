<template>
   <div class="post-detail-page">
       <model title="删除文章" :visible="modalIsVisible" @modal-on-close="hideModal" @modal-on-confirm="hideAndDelete">
           <p>确定要删除这篇文章吗？</p>
       </model>
       <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
           <img :src="currentImageUrl" class="rounded-lg img-fluid my-4">
           <h2 class="mb-4">{{currentPost.title}}</h2>
           <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
               <div class="col">
                   <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
               </div>
               <span class="text-muted col text-end font-italic">发表于：{{currentPost.createdAt}}</span>
           </div>
           <div v-html="currentHTML"></div>
           <div class="btn-group mt-5" v-if="showEditArea">
               <router-link type="button" class="btn btn-success" :to="{name:'create',query:{id:currentPost._id}}">编辑</router-link>
               <button class="btn btn-danger" type="button" @click.prevent="modalIsVisible = true">删除</button>
           </div>
       </article>
   </div>
</template>

<script lang="ts">
import { GlobalDataProps, PostProps, UserProps,ImageProps } from '@/typings';
import { defineComponent, onMounted, ref,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MarkdownIt from "markdown-it"
import message from '@/components/message';
import Model from "@/components/Modal.vue"
import UserProfile from "@/components/UserProfile.vue";

export default defineComponent({
    components:{
      Model,
      UserProfile
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const route = useRoute();
        const router = useRouter();
        const modalIsVisible = ref(false);
        const currentId= route.params.id;
        const md = new MarkdownIt();
        onMounted(()=>{
            store.dispatch("fetchPost",currentId);
        })
        
        const currentPost = computed<PostProps>(()=> store.getters.getCurrentPost(currentId));
        const currentHTML = computed(()=>{
            const {content,isHTML} = currentPost.value;
            if(currentPost.value && content){
                return isHTML ? content: md.render(content)
            }
        })
        const showEditArea= computed(()=>{
            const {isLogin, _id} = store.state.user;
            if(currentPost.value && currentPost.value.author && isLogin){
                const postAuthor = currentPost.value.author as UserProps;
                return postAuthor._id === _id;
            }else{
                return false
            }
        });
        const currentImageUrl = computed(()=>{
            if(currentPost.value && currentPost.value.image){
                const {image} = currentPost.value;
                return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
            }else{
                return require("@/assets/avatar.jpg")
            }
        })
        
        const hideModal = ()=>{
             modalIsVisible.value = false;
        }
        const hideAndDelete= async ()=>{
            hideModal();
            const data:PostProps=await store.dispatch("deletePost",currentId);
            await message.success("删除成功！", 500);
            router.replace({name:"column",params:{id: data.column}})
        }

        return {
            currentPost,
            currentImageUrl,
            currentHTML,
            showEditArea,
            modalIsVisible,
            hideAndDelete,
            hideModal
        }
        
    },
})
</script>
