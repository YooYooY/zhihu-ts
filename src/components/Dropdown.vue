<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      href="@"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click.prevent="toggleOpen"
      >{{ title }}</a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import useClickOutslide from "@/hooks/useClickOutside";
import { defineComponent, inject, provide, ref, watch } from "vue";

// function createContext<T>() {
//   const symbol = Symbol();

//   const useDropdownContext = () => ({
//     dropdownProvider: (providerParams: T) => {
//       provide<T>(symbol, providerParams);
//     },
//     dropdownInject: () => {
//       return inject<T>(symbol);
//     },
//   });

//   return useDropdownContext;
// }

// export const useDropdownContext = createContext<ProviderParam>();

export const dropdownSymbol = Symbol();

export interface ProviderParam {
  toggleOpen: () => void;
}

export default defineComponent({
  name: "Dropdown",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);
    const dropdownRef = ref<null | HTMLElement>(null);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };

    const isClickOutside = useClickOutslide(dropdownRef);

    watch(isClickOutside, (value) => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false;
      }
    });

    provide<ProviderParam>(dropdownSymbol, { toggleOpen });

    // const { dropdownProvider } = useDropdownContext();
    // dropdownProvider({ toggleOpen });

    return {
      isOpen,
      toggleOpen,
      dropdownRef,
    };
  },
});
</script>

<style scoped>
.dropdown-menu {
  right: 0;
}
</style>
