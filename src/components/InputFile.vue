<template>
  <div class="input-file">
    <div class="input-file__item input-file__item--main">
      <div>{{ fileName === null ? '選択されていません' : fileName }}</div>
    </div>
    <div class="input-file__item input-file__item--action">
      <v-btn outlined color="primary" elevation="0" v-on:click="click">ファイル選択</v-btn>
    </div>
    <input
      ref="input"
      v-bind:accept="accept"
      class="input-file__input"
      type="file"
      v-on:change="changeFile"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, SetupContext } from '@vue/composition-api'

type Value = File | null
type Props = {
  value: Value
  label: string | null
  readonly: boolean
  disabled: boolean
  accept: string | null
}
export default defineComponent({
  components: {},
  props: {
    value: { type: null, default: null },
    label: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    accept: { type: String, default: null },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const emitInput = (value: Value) => {
      context.emit('input', value)
    }

    const localValue = computed<Value>({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })

    const fileName = computed(() => localValue.value?.name ?? null)

    const input = ref<HTMLInputElement>()
    const changeFile = async () => {
      const element = input.value
      if (element) {
        localValue.value = element.files?.item(0) ?? null
      }
    }

    const click = async () => {
      const element = input.value
      if (element) {
        element.click()
      }
    }
    return {
      localValue,
      input,
      changeFile,
      fileName,
      click,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-file {
  padding-top: 8px;
  padding-bottom: 8px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 4px;

  .input-file__item {
    display: flex;
    align-items: center;
    &.input-file__item--main {
      flex: 1;
    }
    &.input-file__item--action {
    }
  }

  .input-file__input {
    width: 0px;
    height: 0px;
  }
}
</style>
