<template>
  <InputText
    v-model="roomName"
    label="会議コード"
    icon="mdi-keyboard-outline"
    placeholder="会議コードを入力"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import { RoomName } from '@/models/room'

type Value = string | null
type State = {}
type Props = {
  value: Value
}
export default defineComponent({
  components: { InputText },
  props: {
    value: { type: String, default: null },
  },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({})

    const emitInput = (value: Value) => {
      context.emit('input', value)
    }

    const roomName = computed<Value>({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })

    const clickCreate = async () => {
      roomName.value = RoomName.create()
    }

    return {
      ...toRefs(state),
      roomName,
      clickCreate,
    }
  },
})
</script>

<style lang="scss" scoped></style>
