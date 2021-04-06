<template>
  <teleport to="#modal">
    <div :style="{ pointerEvents: visible ? 'auto' : 'none' }">
      <div class="modal fade" :class="{ show: visible, 'd-block': visible }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-primary">{{ title }}</h5>
              <button
                type="button"
                class="btn-close"
                data-dismiss="modal"
                @click="onClose"
              ></button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" type="button" @click="onClose">
                取消
              </button>
              <button
                class="btn btn-danger"
                type="button"
                @click="onConfirm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" :class="{ show: visible }"></div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useDOMCreate from "@/hooks/useDOMCreate";

export default defineComponent({
  name: "modal",
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["modal-on-close", "modal-on-confirm"],
  setup(props, { emit }) {
    useDOMCreate("modal");
    const onClose = () => {
      emit("modal-on-close");
    };
    const onConfirm = () => {
      emit("modal-on-confirm");
    };
    return {
      onClose,
      onConfirm,
    };
  },
});
</script>
