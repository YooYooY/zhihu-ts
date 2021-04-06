<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="submit-area d-inline-block" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from "mitt"

type ValidateFunc = ()=>boolean;
export const emitter = mitt();

export default defineComponent({
    emits:["form-submit"],
    setup(props,{emit}) {
        let funcArr: ValidateFunc[] = [];
        const submitForm = ()=>{
            const result =  funcArr.map(func=>func()).every(passed=>passed);            
            
            emit("form-submit", result);
        }
        
        const callback = (func?: ValidateFunc)=>{
            if(!func) return;
            funcArr.push(func);
        }
                
        emitter.on("form-item-created",callback);
        
        onUnmounted(()=>{
            emitter.off("form-item-create",callback);
            funcArr = [];
        })        
        
        return {
            submitForm
        }
    },
})
</script>
