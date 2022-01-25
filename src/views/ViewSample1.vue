<template>
  <div class="view-sample1">
    <v-banner v-if="dataConnection" single-line outlined rounded color="primary">
      <div class="text--primary text-body-2">
        <v-icon icon="mdi-lock" color="primary">mdi-lock</v-icon>
        「{{ toPeerId }}」とP2P接続しています
      </div>
    </v-banner>

    <div class="view-sample1__row view-sample1__row--content">
      <v-list two-line width="100%">
        <template v-for="(message, index) in messages">
          <v-card
            v-bind:key="index"
            outlined
            style="margin-bottom: 8px"
            v-bind:style="{
              'margin-left': message.peerId === peerId ? '32px' : null,
              'margin-right': message.peerId === peerId ? null : '32px',
            }"
            v-bind:color="message.peerId === peerId ? 'blue-grey lighten-5' : 'blue lighten-5'"
          >
            <v-card-text>
              <b>{{ message.peerId }}</b>
              <br />
              {{ message.text }}
            </v-card-text>
          </v-card>
        </template>
      </v-list>
    </div>

    <v-footer app color="blue-grey lighten-5" inset style="padding: 16px 8px">
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

    <v-dialog v-model="displayDialog1" width="100%" max-width="480px" persistent>
      <v-card outlined>
        <v-card-title>設定</v-card-title>
        <v-card-text>
          <InputText v-model="apiKey" label="APIキー" disabled />
          <InputText v-model="peerId" label="自分のPeerId" v-bind:disabled="peer !== null" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text v-bind:disabled="peer !== null" v-on:click="clickDone1">
            <v-icon left>mdi-check</v-icon>
            決定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="displayDialog2" width="100%" max-width="280px" persistent>
      <v-card outlined>
        <div
          style="
            width: 200px;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            padding: 16px;
          "
        >
          <v-progress-circular v-bind:size="200" width="10" color="primary" indeterminate>
            接続待機中...
          </v-progress-circular>
        </div>
        <v-divider />
        <v-card-actions>
          <InputText
            v-model="toPeerId"
            label="相手のPeerId"
            v-bind:disabled="dataConnection !== null"
          />
          <v-btn
            text
            color="primary"
            v-bind:disabled="dataConnection !== null"
            v-on:click="clickConnect"
          >
            接続
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Peer, { DataConnection, PeerConstructorOption, PeerError } from 'skyway-js'
import InputText from '@/components/InputText.vue'
import { Dialogs } from '@/dialogs'

const Steps = {
  Step1: 1,
  Step2: 2,
  Step3: 3,
} as const
type Step = typeof Steps[keyof typeof Steps]

type Message = {
  peerId: string
  text: string
}
// eslint-disable-next-line @typescript-eslint/ban-types
type State = {
  step: Step
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
      step: Steps.Step1,
      peerId: '',
      peer: null,
      toPeerId: '',
      dataConnection: null,
      text: '',
      messages: [],
    })

    const displayDialog1 = computed(() => state.step === Steps.Step1)
    const displayDialog2 = computed(() => state.step === Steps.Step2)

    const setPeer = async (peerId: string): Promise<void> => {
      const options: PeerConstructorOption = {
        key: props.apiKey,
        debug: 3,
      }
      const peer = peerId.length >= 1 ? new Peer(peerId, options) : new Peer(options)
      peer.on('open', () => {
        console.info(`peer: open`)
        state.peer = peer
      })
      peer.on('close', () => {
        console.info(`peer: close`)
      })
      peer.on('error', (err: PeerError) => {
        Dialogs.showError(err.message)
      })
      peer.on('connection', (conn: DataConnection) => {
        console.info(`peer: connection`)
        setDataConnection(conn)
      })
    }

    const setDataConnection = async (dataConnection: DataConnection) => {
      dataConnection.on('open', () => {
        console.info(`dataConnection: open`)
        state.toPeerId = dataConnection.remoteId
        state.dataConnection = dataConnection
      })
      dataConnection.on('data', (data: Message) => {
        console.info(`dataConnection: data > ${JSON.stringify(data)}`)
        state.messages.push(data)
      })
      dataConnection.on('close', () => {
        console.info(`dataConnection: close`)
      })
      dataConnection.on('error', (err: PeerError) => {
        Dialogs.showError(err.message)
      })
    }

    const clickDone1 = async () => {
      const peerId = state.peerId
      await setPeer(peerId)
    }

    const clickConnect = async () => {
      const peer = state.peer
      const toPeerId = state.toPeerId
      if (peer === null) {
        await Dialogs.showError(
          'SkyWayの接続準備に失敗しました。ブラウザをリロードして、再度試してみてください',
        )
        return
      }
      if (toPeerId.length === 0) {
        await Dialogs.showError('相手のPeerIDを入力して、決定ボタンをクリックしてください')
        return
      }
      const dataConnection = peer.connect(toPeerId)
      await setDataConnection(dataConnection)
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
      if (peerId.length === 0) {
        await Dialogs.showError('自分のPeerIDを入力して、決定ボタンをクリックしてください')
        return
      }
      if (text.length === 0) {
        await Dialogs.showError('送信するテキストを入力してください')
        return
      }
      if (dataConnection === null) {
        await Dialogs.showError('相手のPeerIDを入力して、決定ボタンをクリックしてください')
        return
      }

      const message: Message = { peerId, text }
      dataConnection.send(message)
      state.messages.push(message)
      state.text = ''
    }

    watch(
      () => state.peer,
      (value: Peer | null) => {
        if (value !== null) {
          state.step = Steps.Step2
        }
      },
    )
    watch(
      () => state.dataConnection,
      (value: DataConnection | null) => {
        if (value !== null) {
          state.step = Steps.Step3
        }
      },
    )

    return {
      ...toRefs(state),
      clickDone1,
      clickConnect,
      clickSend,
      keydownEnter,
      displayDialog1,
      displayDialog2,
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
