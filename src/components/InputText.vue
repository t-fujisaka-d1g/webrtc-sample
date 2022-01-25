<template>
  <div class="input-text">
    <v-text-field
      v-model="localValue"
      v-bind:readonly="readonly"
      v-bind:disabled="disabled"
      outlined
      dense
      v-bind:label="label"
      hide-details
      v-bind:prepend-inner-icon="icon"
      v-bind:placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed } from '@vue/composition-api'

type Value = string | null
type Props = {
  value: string
  label: string | null
  readonly: boolean
  disabled: boolean
  icon: string | null
  placeholder: string | null
}
export default defineComponent({
  components: {},
  props: {
    value: { type: String, default: null },
    label: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: null },
    placeholder: { type: String, default: null },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }
    const localValue = computed<Value>({
      get: () => props.value,
      set: (value: Value) => {
        if (value === null || value.length === 0) {
          emitInput(null)
        } else {
          emitInput(value)
        }
      },
    })
    return {
      localValue,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-text {
  padding-top: 8px;
  padding-bottom: 8px;
  width: 100%;
}
</style>
