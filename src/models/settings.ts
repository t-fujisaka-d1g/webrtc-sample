export interface ISettings {
  apiKey?: string | null
  peerId?: string | null
}

export class Settings {
  constructor(public peerId: string | null, public apiKey: string | null) {}

  public static createDefault(): Settings {
    return new Settings(null, null)
  }

  public static create(data: ISettings): Settings {
    return new Settings(data.peerId ?? null, data.apiKey ?? null)
  }

  toJson(): ISettings {
    return {
      peerId: this.peerId,
      apiKey: this.apiKey,
    }
  }
}
