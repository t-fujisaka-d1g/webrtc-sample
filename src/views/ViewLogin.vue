<template>
  <div>
    <v-card max-width="480px" style="margin: auto" outlined>
      <v-card-text>
        <InputText v-model="apiKey" label="APIキー" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" v-bind:disabled="disabled" v-on:click="clickDone">
          <v-icon left>mdi-check</v-icon>
          設定
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import InputText from '@/components/InputText.vue'
import { RouterHelper } from '@/router/helper'
import { LocalStorage } from '@/localStorage'

type State = {
  apiKey: string
}
export default defineComponent({
  components: { InputText },
  setup() {
    const state = reactive<State>({
      apiKey: '',
    })

    const disabled = computed<boolean>(() => state.apiKey.length === 0)

    const clickDone = async () => {
      const apiKey = state.apiKey
      if (apiKey.length === 0) {
        return null
      }
      await RouterHelper.moveHome(apiKey)
      LocalStorage.apiKey = apiKey
    }
    return {
      ...toRefs(state),
      disabled,
      clickDone,
    }
  },
})
</script>

<style lang="scss" scoped></style>
