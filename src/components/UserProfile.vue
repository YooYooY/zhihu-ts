<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
       <img :src="fitUrl" :alt="user.nickName" class="rounded-circle img-thumbnail">
       <div class="detail mx-2">
           <h6 class="d-block mb-0">{{user.nickName}}</h6>
           <span class="text-truncate text-muted d-block">{{user.description}}</span>
       </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserProps } from "@/typings";
import { addColumnAvatar } from "@/utils";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },
  setup(props) {
    const fitUrl = computed(() => {
      addColumnAvatar(props.user, 50, 50);
      const {avatar} = props.user;
      return avatar && avatar.fitUrl
    });
    return {
        fitUrl
    }
  },
});
</script>

<style scoped>
.user-profile-component img{
    width: 50px;
    height: 50px;
}
</style>