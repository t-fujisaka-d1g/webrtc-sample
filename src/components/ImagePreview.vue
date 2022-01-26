<template>
  <v-img contain aspect-ratio="1" v-bind:src="imageSrc">
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="primary" size="40" />
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'

type State = {
  imageSrc: string | null
}
type Props = {
  file: File | null
}
export default defineComponent({
  components: {},
  props: {
    file: { type: null, default: null },
  },
  setup(props: Props) {
    const state = reactive<State>({
      imageSrc: null,
    })

    watch(
      () => props.file,
      async (value: File | null) => {
        if (value) {
          const array = await value.arrayBuffer()
          const blob = new Blob([array], { type: value.type })
          state.imageSrc = window.URL.createObjectURL(blob)
        } else {
          state.imageSrc = null
        }
      },
      { immediate: true },
    )

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
