<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">email:</label>
        <validate-input
          :rules="emailRules"
          v-model="formData.email"
          placeholder="please input email"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">nickname:</label>
        <validate-input
          :rules="nameRules"
          v-model="formData.nickName"
          placeholder="please input nickName"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">password:</label>
        <validate-input
          :rules="passwordRules"
          v-model="formData.password"
          placeholder="please input password"
          type="password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">repeat password:</label>
        <validate-input
          :rules="repeatPasswordRules"
          v-model="formData.repeatPassword"
          placeholder="please input repeat password"
          type="password"
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import ValidateInput, { RulesProp } from "@/components/ValidateInput.vue";
import ValidateForm from "@/components/ValidateForm.vue";
import { useRouter } from "vue-router";
import { signupUser } from "@/request";
import message from "@/components/message";

export default defineComponent({
  name: "Signup",
  components: {
    ValidateForm,
    ValidateInput,
  },
  setup() {
    const formData = reactive({
      email: "13751840799@163.com",
      nickName: "chenwl",
      password: "123456",
      repeatPassword: "123456",
    });
    
    const router = useRouter();

    const emailRules: RulesProp = [
      { type: "required", message: "email required!" },
      { type: "email", message: "please input corrected email type" },
    ];
    const nameRules: RulesProp = [
      { type: "required", message: "nickName can't be empty" },
    ];
    const passwordRules: RulesProp = [
      { type: "required", message: "password can't be empty" },
    ];
    const repeatPasswordRules: RulesProp = [
      { type: "required", message: "repeat password can't be empty" },
      {
        type: "custom",
        validator: () => {
          return formData.password === formData.repeatPassword;
        },
        message: "password not same",
      },
    ];

    const onFormSubmit = (result: boolean) => {
      
      if(!result) return;
      const payload = {
        email: formData.email,
        nickName: formData.nickName,
        password: formData.password,
      }

      signupUser(payload).then(res=>{
        message.success("注册成功！正在调整页面~").then(()=>{
          router.push("/login")
        })
        
      }).catch(error=>{
        message.danger(error)
      })
    };

    return {
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
      onFormSubmit,
      formData,
    };
  },
});
</script>
