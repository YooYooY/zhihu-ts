import { computed, ref, watch } from 'vue'

const useModel = <T>(getter: () => T, emitter: (val: T) => void) => {
  const model = ref(getter()) as { value: T }

  watch(getter, (newVal) => {
    if (newVal !== model.value) {
      model.value = newVal
    }
  })

  return {
    get value() {
      return model.value
    },
    set value(val: T) {
      model.value = val
      emitter(val)
    },
  }
}

// const useModel = function<T>(val: T, emitter: (newVal: T) => void) {
//   const model = ref(val) as {value: T}

//   watch(
//     () => model.value,
//     (val: T) => {
//       emitter(val)
//     }
//   )

//   return model
// }

export default useModel
