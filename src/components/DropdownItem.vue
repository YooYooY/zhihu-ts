<template>
  <li class="dropdown-option" :class="{ 'is-disabled': disabled }" @click.prevent="toggleOpen">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
// import { useDropdownContext } from "./Dropdown.vue";
import { dropdownSymbol,ProviderParam } from "./Dropdown.vue";

export default defineComponent({
  name: "DropdownItem",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    // const { dropdownInject } = useDropdownContext();
    // const { toggleOpen } = dropdownInject()!;
    const { toggleOpen } = inject<ProviderParam>(dropdownSymbol)!;

    return {
      toggleOpen,
    };
  },
});
</script>

<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
