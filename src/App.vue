<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import AppBar from '@/components/AppBar.vue'

type State = {
  //
}
export default defineComponent({
  components: { AppBar },
  setup() {
    const state = reactive<State>({})

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped></style>
