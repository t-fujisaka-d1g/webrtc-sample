<template>
  <v-app-bar app color="primary" dark fixed>
    <v-btn v-if="toHome !== null" icon v-bind:to="toHome">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <v-spacer />
    <a style="color: white; opacity: 0.2" v-bind:href="commitUrl" target="_blank">
      {{ commitHash7 }}
    </a>
  </v-app-bar>
</template>

<script lang="ts">
import { computed, defineComponent, SetupContext } from '@vue/composition-api'
import { RouteLocations, RouteNames } from '@/router/models'
import { Sample, SampleIds } from '@/models/sample'
import { Env } from '@/env'
import { Location } from 'vue-router'

export default defineComponent({
  components: {},
  setup(_: unknown, context: SetupContext) {
    const title = computed<string>(() => {
      const routeName = context.root.$route.name
      switch (routeName) {
        case RouteNames.Sample1:
          return Sample.find(SampleIds.One).title
        case RouteNames.Sample2:
          return Sample.find(SampleIds.Two).title
        case RouteNames.Sample3:
          return Sample.find(SampleIds.Three).title
        default:
          return Env.title
      }
    })

    const toHome = computed<Location | null>(() => {
      const routeName = context.root.$route.name
      const apiKey = context.root.$route.params.apiKey
      if (apiKey) {
        switch (routeName) {
          case RouteNames.Sample1:
          case RouteNames.Sample2:
          case RouteNames.Sample3:
            return RouteLocations.toHome(apiKey)
        }
      }

      return null
    })

    const commitHash7 = Env.commitHash?.substring(0, 7) ?? ''
    const commitUrl = Env.commitUrl

    return {
      title,
      toHome,
      commitHash7,
      commitUrl,
    }
  },
})
</script>

<style lang="scss" scoped></style>
