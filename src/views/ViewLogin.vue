<template>
  <div>ViewLogin</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {}
type Props = {}
export default defineComponent({
  components: {},
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
