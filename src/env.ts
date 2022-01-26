export class Env {
  static get title(): string {
    return process.env.VUE_APP_TITLE ?? 'タイトル'
  }
  static get commitHash(): string | null {
    return process.env.VUE_APP_COMMIT_HASH ?? null
  }
  static get commitUrl(): string | null {
    if (this.commitHash === null) {
      return null
    }
    return `https://github.com/t-fujisaka-d1g/webrtc-sample/commit/${this.commitHash}`
  }
  static get gitHubPagesUrl(): string {
    return 'https://t-fujisaka-d1g.github.io/webrtc-sample'
  }

  static calcSample2ShareUrl(apiKey: string, peerId: string): string {
    return `${this.gitHubPagesUrl}/${apiKey}/sample2/${peerId}`
  }
}
