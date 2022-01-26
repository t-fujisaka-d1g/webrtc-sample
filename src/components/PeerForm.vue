<template>
  <InputText v-model="peerId" label="PeerID" icon="mdi-account" placeholder="PeerIDを入力" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type Value = string | null
type State = {}
type Props = {
  value: Value
}
export default defineComponent({
  components: { InputText },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({})

    const emitInput = (value: Value) => {
      context.emit('input', value)
    }

    const peerId = computed<Value>({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })

    return {
      ...toRefs(state),
      peerId,
    }
  },
})
</script>

<style lang="scss" scoped></style>
