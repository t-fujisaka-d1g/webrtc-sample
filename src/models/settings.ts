export interface ISettings {
  peerId?: string | null
}

export class Settings {
  constructor(public peerId: string | null) {}

  public static createDefault(): Settings {
    return new Settings(null)
  }

  public static create(data: ISettings): Settings {
    return new Settings(data.peerId ?? null)
  }

  toJson(): ISettings {
    return {
      peerId: this.peerId,
    }
  }
}
