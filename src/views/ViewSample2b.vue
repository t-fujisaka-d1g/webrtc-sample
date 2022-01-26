<template>
  <v-row style="max-width: 480px; width: 100%; margin: auto">
    <v-card width="100%" outlined style="margin: auto">
      <v-card-title>ファイル共有</v-card-title>
      <ImagePreview v-bind:file="file" />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" v-on:click="clickDownload">
          <v-icon left>mdi-download</v-icon>
          ダウンロード
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import Peer, { PeerConstructorOption, PeerError } from 'skyway-js'
import ImagePreview from '@/components/ImagePreview.vue'

type State = {
  peer: Peer | null
  file: File | null
}
type Props = {
  apiKey: string
  peerId: string
}
export default defineComponent({
  components: { ImagePreview },
  props: {
    apiKey: { type: String, required: true },
    peerId: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      peer: null,
      file: null,
    })

    onMounted(() => {
      initPeer()
    })

    const clickDownload = async () => {
      const file = state.file
      if (file) {
        const array = await file.arrayBuffer()
        const blob = new Blob([array], { type: file.type })
        const element = document.createElement('a')
        document.body.appendChild(element)
        element.href = window.URL.createObjectURL(blob)
        element.setAttribute('download', file.name)
        element.click()
      }
    }

    const initPeer = async () => {
      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)
        receiveFile(peer)
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })
    }
    const receiveFile = async (peer: Peer) => {
      const dataConnection = peer.connect(props.peerId)
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)
      })
      dataConnection.on('data', async (data: File) => {
        console.info(`dataConnection: close`)

        state.file = data
      })
      dataConnection.on('close', () => {
        console.info(`dataConnection: close`)
      })
      dataConnection.on('error', (err: PeerError) => {
        console.info(`dataConnection: error > ${JSON.stringify(err)}`)
      })
    }

    return {
      ...toRefs(state),
      clickDownload,
    }
  },
})
</script>

<style lang="scss" scoped></style>
