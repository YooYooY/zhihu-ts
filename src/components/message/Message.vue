<template>
    <div
      class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-1"
      :class="classes"
      :style="styles"
      v-if="isVisible"
    >
      <span>
        {{ options.message }}
      </span>
      <button class="btn-close" type="button" @click.prevent="handler.close"></button>
    </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  ref,
} from "vue";
import { MessageOptions, AniCls } from "./typing";
import { delay } from "@/utils";

let indexArr = [] as Array<null | Symbol>;

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<MessageOptions>,
      required: true,
    },
  },
  setup(props) {
    const isVisible= ref(true);
    const actionDur = 200;
    const aniCls = ref<AniCls | null>(null);
      
    const type = props.options.type === "error" ? "danger" :  props.options.type;
      
    const classes = computed(() => [
      aniCls.value,
      `alert-${type}`,
    ]);
    
    const symbol = Symbol();
    const top = (()=>{
      // 查询为 null 的位置
      let i = indexArr.indexOf(null);            
      if(i>=0){
        // 插入到 null 的位置
        indexArr.splice(i,1,symbol);
        return i*60 + "px"
      }else{
        // 没有表示都未销毁，就按最大高度
        let len = indexArr.length
        indexArr.push(symbol);
        return len*60 + "px"
      }
    })();
    
    const styles = {
      "animationDuration": actionDur/1000 + "s",
      "top":top
    }
    
    const handler = {
      async show() {
        aniCls.value = "fade-in";
        return await delay(actionDur);
      },
      async close() {
        aniCls.value = "fade-out";
        await delay(actionDur);
        // 找到当前缓存的位置，重置为null
        const i = indexArr.indexOf(symbol)
        indexArr.splice(i,1,null);
        // 都为null时，重置缓存数组
        if(indexArr.every(item=>!item)){
          indexArr = []
        };
        return isVisible.value = false;
      },
    };

    const ctx = getCurrentInstance()!;

    Object.assign(ctx.proxy, handler);

    return {
      handler,
      styles,
      classes,
      isVisible
    };
  },
});
</script>

<style scoped>
.alert.message-info.fade-in {
  animation-name: fadeInDown;
}
.alert.message-info.fade-out {
  pointer-events: none;
  animation-name: fadeOutUp;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-50%);
  }
}
</style>