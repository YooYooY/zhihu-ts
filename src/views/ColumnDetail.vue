<template>
  <div class="column-detail-page w-75 mx-auto">
    <div
      class="column-info row bm-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.fitUrl"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { ColumnProps, GlobalDataProps } from "@/typings";
import { addColumnAvatar } from "@/utils";
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import PostList from "@/components/PostList.vue";

export default defineComponent({
  components:{
    PostList
  },
  setup() {
    const route = useRoute();
    1;
    const store = useStore<GlobalDataProps>();
    const currentId = route.params.id;
    onMounted(() => {
      store.dispatch("fetchColumn", currentId);
      store.dispatch("fetchPosts", currentId);
    });

    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as
        | ColumnProps
        | undefined;
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100);
      }
      return selectColumn;
    });

    const list = computed(() => store.getters.getPostsByCid(currentId));

    return {
      column,
      list,
    };
  },
});
</script>
