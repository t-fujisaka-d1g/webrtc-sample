<template>
  <div class="view-sample1">
    <div class="view-sample1__row view-sample1__row--content">
      <v-list two-line width="100%">
        <template v-for="(message, index) in messages">
          <template v-if="message.peerId === peerId">
            <v-card
              v-bind:key="index"
              outlined
              style="margin-bottom: 8px; text-align: right"
              color="blue-grey lighten-5"
            >
              <v-card-text>
                <b>{{ message.peerId }}</b>
                <br />
                {{ message.text }}
              </v-card-text>
            </v-card>
          </template>
          <template v-else>
            <v-card v-bind:key="index" outlined style="margin-bottom: 8px" color="blue lighten-5">
              <v-card-text>
                <b>{{ message.peerId }}</b>
                <br />
                {{ message.text }}
              </v-card-text>
            </v-card>
          </template>
        </template>
      </v-list>
    </div>

    <v-footer app color="gray" inset style="padding: 16px 8px">
      <v-text-field
        v-model="text"
        background-color="white"
        dense
        outlined
        hide-details="auto"
        placeholder="送信するテキストを入力してください"
        v-bind:append-icon="text === null || text.length === 0 ? null : 'mdi-send'"
        v-on:click:append="clickSend"
        v-on:keydown.enter.meta.exact="keydownEnter"
      />
    </v-footer>

    <v-dialog v-model="displayDialog" width="100%" max-width="480px" persistent>
      <v-card outlined>
        <v-card-title>設定</v-card-title>
        <v-list dense>
          <v-list-item>
            <InputText v-model="apiKey" label="APIキー" disabled />
            <v-list-item-action>
              <div style="width: 64px" />
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <InputText v-model="peerId" label="自分のPeerId" v-bind:disabled="peer !== null" />
            <v-list-item-action>
              <v-btn color="primary" v-bind:disabled="peer !== null" v-on:click="clickDone1">
                決定
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <InputText
              v-model="toPeerId"
              label="相手のPeerId"
              v-bind:disabled="dataConnection !== null"
            />
            <v-list-item-action>
              <v-btn
                color="primary"
                v-bind:disabled="dataConnection !== null"
                v-on:click="clickConnect"
              >
                接続
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Peer, { DataConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import InputText from '@/components/InputText.vue'

type Message = {
  peerId: string
  text: string
}
// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  displayDialog: boolean
  peerId: string
  peer: Peer | null
  toPeerId: string
  dataConnection: DataConnection | null
  text: string
  messages: Message[]
}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: { InputText },
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const state = reactive<State>({
      displayDialog: true,
      peerId: '',
      peer: null,
      toPeerId: '',
      dataConnection: null,
      text: '',
      messages: [],
    })

    const clickDone1 = async () => {
      const peerId = state.peerId

      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = peerId.length >= 1 ? new Peer(peerId, options) : new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        console.info(`peer: error > ${JSON.stringify(err)}`)
      })
      peer.on('connection', (conn: DataConnection) => {
        console.info(`peer: connection`)
        setDataConnection(conn)
      })

      state.peer = peer
    }

    const clickConnect = async () => {
      const peer = state.peer
      const toPeerId = state.toPeerId
      if (peer === null || toPeerId.length === 0) {
        alert('ERROR')
        return
      }
      const dataConnection = peer.connect(toPeerId)
      setDataConnection(dataConnection)
    }

    const keydownEnter = async (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        await clickSend()
      }
    }
    const clickSend = async () => {
      const peerId = state.peerId
      const text = state.text
      const dataConnection = state.dataConnection
      if (peerId.length === 0 || text.length === 0 || dataConnection === null) {
        alert('ERROR')
        return
      }

      const message: Message = { peerId, text }
      dataConnection.send(message)
      state.messages.push(message)
      state.text = ''
    }

    const setDataConnection = (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)
      })
      dataConnection.on('data', (data: Message) => {
        console.info(`dataConnection: data > ${JSON.stringify(data)}`)
        state.messages.push(data)
      })
      dataConnection.on('close', () => {
        console.info(`dataConnection: close`)
      })
      dataConnection.on('error', (err: PeerError) => {
        console.info(`dataConnection: error > ${JSON.stringify(err)}`)
      })
      state.toPeerId = dataConnection.remoteId
      state.dataConnection = dataConnection

      // ダイアログを閉じる
      state.displayDialog = false
    }

    watch(
      () => state.dataConnection,
      (value: DataConnection | null) => {
        state.displayDialog = value === null
      },
    )

    return {
      ...toRefs(state),
      clickDone1,
      clickConnect,
      clickSend,
      keydownEnter,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-sample1 {
  display: flex;
  flex-direction: column;
  .view-sample1__row {
    display: flex;
    &.view-sample1__row--header {
      justify-content: center;
      align-items: center;
    }
    &.view-sample1__row--content {
      flex: 1;
      padding-bottom: 50px;
    }
    &.view-sample1__row--footer {
      position: fixed;
      left: 0px;
      right: 0px;
      bottom: 0px;
      width: 100%;
      padding: 2px 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      border-top: 1px lightgray solid;
      background: white;
    }
  }
}
</style>
