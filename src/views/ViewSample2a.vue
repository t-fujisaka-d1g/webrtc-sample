<template>
  <v-row style="max-width: 800px; margin: auto">
    <v-col cols="12" md="6">
      <v-card outlined>
        <v-card-title>ファイル共有</v-card-title>
        <ImagePreview v-if="file !== null" v-bind:file="file" />
        <v-card-text>
          <InputFile v-model="file" label="ファイル" accept="image/*" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" v-on:click="clickShare">
            <v-icon left>mdi-share</v-icon>
            共有開始
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <template v-if="shareUrl">
        <v-card outlined>
          <QrCode v-bind:data="shareUrl" v-bind:size="400" />
          <v-card-text class="text--primary" style="padding-top: 0px; word-break: break-all">
            <a v-bind:href="shareUrl" target="_blank">{{ shareUrl }}</a>
          </v-card-text>
        </v-card>
      </template>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/composition-api'
import Peer, { DataConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import { Env } from '@/env'
import QrCode from '@/components/QrCode.vue'
import InputFile from '@/components/InputFile.vue'
import ImagePreview from '@/components/ImagePreview.vue'

type State = {
  peer: Peer | null
  file: File | null
  shareUrl: string | null
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { ImagePreview, InputFile, QrCode },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      peer: null,
      file: null,
      shareUrl: null,
    })

    const peerId = computed(() => state.peer?.id ?? null)

    const clickShare = async () => {
      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)

        state.peer = peer
        state.shareUrl = Env.calcSample2ShareUrl(props.apiKey, peerId.value ?? '')
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })
      peer.on('connection', (conn: DataConnection) => {
        console.info(`peer: connection`)
        sendFile(conn)
      })
    }

    const sendFile = async (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)

        const file = state.file
        if (file) {
          dataConnection.send(file)
        }
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
      clickShare,
      peerId,
    }
  },
})
</script>

<style lang="scss" scoped></style>
