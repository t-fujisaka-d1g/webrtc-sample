<template>
  <div>
    <template v-for="item in items">
      <v-card v-bind:key="item.key" outlined v-bind:to="item.to" style="margin-bottom: 8px">
        <v-card-title>{{ item.title }}</v-card-title>
        <v-card-subtitle>{{ item.subTitle }}</v-card-subtitle>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { Location } from 'vue-router'
import { Sample } from '@/models/sample'

type Item = {
  key: number
  title: string
  subTitle: string
  to: Location
}
// eslint-disable-next-line @typescript-eslint/ban-types
type State = {}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: {},
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({})
    const items: Item[] = Sample.all
      .filter((v) => v.isDisplay)
      .map((v) => {
        return {
          key: v.id,
          title: v.title,
          subTitle: v.subTitle,
          to: v.calcLocation(props.apiKey),
        }
      })

    return {
      ...toRefs(state),
      items,
    }
  },
})
</script>

<style lang="scss" scoped></style>
