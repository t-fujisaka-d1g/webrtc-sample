<template>
  <v-select
    v-model="localValue"
    dense
    v-bind:items="items"
    hide-details
    v-bind:label="label"
    outlined
    v-bind:prepend-inner-icon="icon"
  />
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from '@vue/composition-api'

export type BaseSelectItem = {
  text: string | number | unknown
  value: string | number | unknown | null
  disabled?: boolean
  divider?: boolean
  header?: string
}
type Value = string | null | unknown
type Props = {
  value: Value
  label: string | null
  items: BaseSelectItem[]
  icon: string | null
}
export default defineComponent({
  components: {},
  props: {
    value: { type: null, required: true },
    label: { type: String, default: null },
    items: { type: Array, required: true },
    icon: { type: String, default: null },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const emitInput = (valeu: Value) => {
      context.emit('input', valeu)
    }
    const localValue = computed({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })
    return {
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
