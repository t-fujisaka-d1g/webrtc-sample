import Vue from 'vue'
import type { defineComponent } from '@vue/composition-api'

declare module '*.vue' {
  const component: defineComponent<{}, {}, any>
  export default component
}

declare global {
  interface Window {
    vmApp: Vue
  }
}
