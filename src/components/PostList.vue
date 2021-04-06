<template>
  <div class="post-list mt-3">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>
          <router-link class="nav-link" :to="`/posts/${post._id}`">{{
            post.title
          }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <div class="col-4" v-if="post.image">
            <img
              class="rounded-lg w-100"
              :src="getImage(post)"
              :alt="post.title"
            />
          </div>
          <p class="text-muted" :class="{ 'col-8': post.image }">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { ImageProps, PostProps } from "@/typings";
import { generateFitUrl } from "@/utils";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  name: "post-list",
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>,
    },
  },
  setup(props) {
    const posts = computed(() => {
      return props.list.map((post) => {
        generateFitUrl( post.image as ImageProps, 200, 110, ["m_fill"]);
        return post;
      });
    });

    const getImage = (post: PostProps) => {
      const image = post.image as ImageProps;
      return image.fitUrl;
    };

    return {
      posts,
      getImage
    };
  },
});
</script>
