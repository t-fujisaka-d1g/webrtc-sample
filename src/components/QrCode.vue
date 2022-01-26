<template>
  <v-img aspect-ratio="1" width="100%" v-bind:src="url">
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

type State = {
  width: number
  height: number
}
type Props = {
  size: number
  data: string
}
export default defineComponent({
  components: {},
  props: {
    size: { type: Number, default: 280 },
    data: { type: String, default: 'HelloWorld' },
  },
  setup(props: Props) {
    const state = reactive<State>({
      width: props.size,
      height: props.size,
    })
    const createUrl = (size: number, data: string): string => {
      return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(
        data,
      )}`
    }
    const url = createUrl(props.size, props.data)

    return {
      ...toRefs(state),
      url,
    }
  },
})
</script>

<style lang="scss" scoped>
.qr-code {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  box-sizing: border-box;
  overflow: hidden;
  background-size: contain;

  .qr-code__iframe {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
  }
}
</style>
