<template>
  <div>ViewSample3(APIキー: {{ apiKey }})</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: {},
  props: {
    apiKey: { type: String, required: true },
  },
  setup() {
    // state
    const state = reactive<State>({})

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
