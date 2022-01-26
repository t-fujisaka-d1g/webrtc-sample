<template>
  <div class="room-form">
    <div class="room-form__row">
      <CameraSelect v-model="deviceId" />
      <v-btn text color="primary" v-bind:disabled="deviceId === null" v-on:click="clickDone">
        決定
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import { Dialogs } from '@/dialogs'

type State = {
  deviceId: string | null
}
export default defineComponent({
  components: { CameraSelect, InputText },
  emits: ['click-done'],
  setup(_: unknown, context: SetupContext) {
    const state = reactive<State>({
      deviceId: null,
    })

    const emitClickDone = (mediaStream: MediaStream) => {
      context.emit('click-done', mediaStream)
    }
    const clickDone = async () => {
      const deviceId = state.deviceId
      if (deviceId === null) {
        return
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId,
          },
          audio: true,
        })
        emitClickDone(mediaStream)
      } catch (e) {
        await Dialogs.showError(e.message)
      }
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
