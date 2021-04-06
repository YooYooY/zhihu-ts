<template>
  <div class="row">
    <div class="col-4 mb-4" v-for="column in columnList" :key="column._id">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar && column.avatar.fitUrl"
            :alt="column.title"
            class="rounded-circle border border-light my-3"
          />
          <div class="rounded-circle border border-light my-3">
            <h5 class="card-title">{{ column.title }}</h5>
            <p class="card-text text-left">{{ column.description }}</p>
            <router-link
              :to="`/column/${column._id}`"
              class="btn btn-outline-primary"
              >进入专栏</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ColumnProps } from "@/typings";
import { addColumnAvatar } from "@/utils";
import { computed, defineComponent, mergeProps, PropType } from "vue";

export default defineComponent({
  name: "ColumnList",
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true,
    },
  },
  setup(props) {
    const columnList = computed(() => {
      return props.list.map((column) => {
        addColumnAvatar(column, 50, 50);
        return column;
      });
    });
    return {
      columnList,
    };
  },
});
</script>
