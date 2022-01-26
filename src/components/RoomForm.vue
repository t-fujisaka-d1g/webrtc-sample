<template>
  <div class="room-form">
    <div class="room-form__row">
      <v-btn color="primary" v-on:click="clickStart">
        <v-icon left>mdi-video-outline</v-icon>
        会議を開始
      </v-btn>
    </div>
    <div class="room-form__row">
      <InputText
        v-model="localRoomName"
        label="会議コード"
        icon="mdi-keyboard-outline"
        placeholder="会議コードを入力"
      />
      <v-btn text color="primary" v-bind:disabled="localRoomName === null" v-on:click="clickJoin">
        参加
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type State = {
  localRoomName: string | null
}
type Props = {
  roomName: string | null
}
export default defineComponent({
  components: { InputText },
  props: {
    roomName: { type: String, default: null },
  },
  emits: ['click-join'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({
      localRoomName: props.roomName,
    })

    const emitJoin = (localRoomName: string) => {
      context.emit('click-join', localRoomName)
    }
    const clickStart = async () => {
      const localRoomName = createRoomName()
      emitJoin(localRoomName)
    }
    const clickJoin = async () => {
      const localRoomName = state.localRoomName ?? createRoomName()
      emitJoin(localRoomName)
    }
    const createRoomName = (): string => {
      const createCode = (len: number): string => {
        const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let r = ''
        for (let num = 1; num <= len; num++) {
          r += c[Math.floor(Math.random() * c.length)]
        }
        return r
      }
      return `${createCode(3)}-${createCode(4)}-${createCode(3)}`
    }

    return {
      ...toRefs(state),
      clickStart,
      clickJoin,
    }
  },
})
</script>

<style lang="scss" scoped>
.room-form {
  display: flex;
  flex-direction: column;
  .room-form__row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 0px;
  }
}
</style>
