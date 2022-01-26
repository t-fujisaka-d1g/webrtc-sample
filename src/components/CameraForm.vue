<template>
  <CameraSelect v-model="deviceId" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  SetupContext,
  toRefs,
  watch,
} from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import CameraSelect from '@/components/CameraSelect.vue'
import { Dialogs } from '@/dialogs'

type Value = MediaStream | null
type State = {
  deviceId: string | null
}
type Props = {
  value: Value
}
export default defineComponent({
  components: { CameraSelect, InputText },
  emits: ['input'],
  setup(props: Props, context: SetupContext) {
    const state = reactive<State>({ deviceId: null })

    const emitInput = (value: Value) => {
      context.emit('input', value)
    }

    const mediaStream = computed<MediaStream | null>({
      get: () => props.value,
      set: (value: Value) => {
        emitInput(value)
      },
    })

    watch(
      () => state.deviceId,
      (deviceId: string | null) => {
        if (deviceId === null) {
          releaseMediaStream()
        } else {
          changeMediaStream(deviceId)
        }
      },
    )

    const changeMediaStream = async (deviceId: string) => {
      await releaseMediaStream()

      try {
        mediaStream.value = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId,
          },
          audio: true,
        })
      } catch (e) {
        await Dialogs.showError(e.message)
      }
    }

    const releaseMediaStream = async () => {
      const ms = mediaStream.value
      if (ms !== null) {
        ms.clone()
        mediaStream.value = null
      }
    }

    return {
      ...toRefs(state),
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
