<template>
    <div class="login-page mx-auto p-3 w-330">
        <h5 class="my-4 text-context">登录到cc</h5>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input :rule="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input :rule="passwordRules" v-model="passwordVal" placeholder="请输入密码" type="password" />
            </div>
            <template #submit>
                <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput,{RulesProp} from "@/components/ValidateInput.vue"
import ValidateForm from "@/components/ValidateForm.vue"
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import message from '@/components/message';

export default defineComponent({
    components:{
     ValidateInput,
     ValidateForm 
    },
    setup() {
        const emailVal = ref("1111@test.com");
        const router= useRouter();
        const store = useStore();
        const emailRules:RulesProp = [
            {type: "required", message: "电子邮箱地址不能为空"},
            {type:"email",message:"请输入正确电子邮箱格式"},
        ]
        
        const passwordVal = ref("111111");
        const passwordRules: RulesProp = [
            {type:"required",message:"密码不能为空"}
        ];
        
        const onFormSubmit = async (result: boolean)=>{                        
            if(!result) return;
            const payload = {
                email: emailVal.value,
                password: passwordVal.value
            };
            try{
                await store.dispatch("loginAndFetch",payload);
                message.success("登录成功!");
                router.push("/");                
            }catch(err){
                message.danger("error")
            }
        }
        
        return {
            emailRules,
            emailVal,
            passwordVal,
            passwordRules,
            onFormSubmit
        }
    },
})
</script>

