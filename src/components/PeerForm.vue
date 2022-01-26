<template>
  <div class="room-form">
    <div class="room-form__row">
      <InputText v-model="peerId" label="PeerID" icon="mdi-account" placeholder="PeerIDを入力" />
      <v-btn text color="primary" v-bind:disabled="peerId === null" v-on:click="clickDone">
        決定
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'

type State = {
  peerId: string | null
}
export default defineComponent({
  components: { InputText },
  emits: ['click-done'],
  setup(_: unknown, context: SetupContext) {
    const state = reactive<State>({
      peerId: null,
    })

    const emitClickDone = (peerId: string) => {
      context.emit('click-done', peerId)
    }
    const clickDone = async () => {
      const peerId = state.peerId
      if (peerId === null) {
        return
      }
      emitClickDone(peerId)
    }

    return {
      ...toRefs(state),
      clickDone,
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
