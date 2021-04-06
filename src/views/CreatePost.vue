<template>
  <div class="create-post-page m-auto w-75">
    <h4>{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <uploader
      action="upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary"></div>
          <span class="sr-only">loading...</span>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData && dataProps.uploadedData.url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          :rules="contentRules"
          v-model="contentVal"
          placeholder="请输入文章详情"
          type="text"
          tag="textarea"
          rows="10"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "更新文章" : "发表文章" }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Uploader from "@/components/Uploader.vue";
import ValidateForm from "@/components/ValidateForm.vue";
import ValidateInput, { RulesProp } from "@/components/ValidateInput.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps, ImageProps, PostProps, UserProps } from "@/typings";
import message from "@/components/message";
import { beforeUploadCheck } from "@/utils";

export default defineComponent({
  name: "createPost",
  components: {
    Uploader,
    ValidateForm,
    ValidateInput,
  },
  setup() {
    const uploadedData = ref();
    const titleVal = ref("");
    const router = useRouter();
    const route = useRoute();
    const isEditMode = !!route.query.id;
    const store = useStore<GlobalDataProps>();
    let imageId = "";
    const titleRules: RulesProp = [
      { type: "required", message: "title must get value" },
    ];
    const contentVal = ref("");
    const contentRules: RulesProp = [
      { type: "required", message: "content must has value" },
    ];

    onMounted(async () => {
      if (isEditMode) {
        const currentPost = await store.dispatch("fetchPost", route.query.id);

        if (currentPost.image) {
          uploadedData.value = { url: currentPost.image.url };
        }
        titleVal.value = currentPost.title;
        contentVal.value = currentPost.content || "";
      } else {
        let storeImage = localStorage.getItem("uploadImage");
        if (storeImage) {
          let { _id, url } = JSON.parse(storeImage);
          imageId = _id;
          uploadedData.value = { url };
        }
      }
    });

    const handleFileUploaded = ({ _id, url }: ImageProps) => {
      if (_id) {
        localStorage.setItem("uploadImage", JSON.stringify({ _id, url }));
        imageId = _id;
      }
    };

    const onFormSubmit = async (result: boolean) => {
      if (!result) return;

      const { column, _id } = store.state.user;

      if (column) {
        const newPost: PostProps = {
          title: titleVal.value,
          content: contentVal.value,
          column,
          author: _id,
        };
        if (imageId) {
          newPost.image = imageId;
        }
        const actionName = isEditMode ? "updatePost" : "createPost";
        const updateName = isEditMode ? "更新" : "创建";
        const sendData = isEditMode
          ? {
              id: route.query.id,
              payload: newPost,
            }
          : newPost;

        try {            
          await store.dispatch(actionName, sendData);
          await message.success(`${updateName} 成功`, 500);
          router.push({ name: "column", params: { id: column } });
          localStorage.removeItem("uploadImage");
        } catch (err) {
          message.error(`${updateName} 失败`);
        }
      }
    };

    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ["image/jpeg", "image/png"],
        size: 1,
      });
      const { passed, error } = result;
      if (error === "format") {
        message.error("只能上传 png/jpg 格式");
      }
      if (error === "size") {
        message.error("上传图片超过1Mb");
      }
      return passed;
    };

    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode,
    };
  },
});
</script>

<style>
.create-post-page .file-upload-container {
  height: 150px;
  cursor: pointer;
  overflow: hidden;
  background-color: #ddd;
  text-align: center;
  color: #999;
  margin-bottom: 20px;
  padding: 20px;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  height: 100%;
  width: 100%;
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
