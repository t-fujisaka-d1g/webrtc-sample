import { Location } from 'vue-router'
import { RouteLocations } from '@/router/models'

export const SampleIds = {
  One: 1,
  Two: 2,
  Three: 3,
} as const
export type SampleId = typeof SampleIds[keyof typeof SampleIds]
export class Sample {
  constructor(public id: SampleId, public title: string, public subTitle: string) {}

  get isDisplay(): boolean {
    switch (this.id) {
      case SampleIds.One:
      case SampleIds.Two:
      case SampleIds.Three:
        return true
      default:
        return false
    }
  }

  static find(id: SampleId): Sample {
    return this.all.find((v) => v.id === id) as Sample
  }

  static get all(): Sample[] {
    return [
      new Sample(SampleIds.One, 'サンプル1', 'テキスト送信'),
      new Sample(SampleIds.Two, 'サンプル2', 'ファイル共有'),
      new Sample(SampleIds.Three, 'サンプル3', 'ルーム通話(映像・音声・テキスト)'),
    ]
  }

  calcLocation(apiKey: string): Location {
    switch (this.id) {
      case 1:
        return RouteLocations.toSample1(apiKey)
      case 2:
        return RouteLocations.toSample2a(apiKey)
      case 3:
        return RouteLocations.toSample3(apiKey)
    }
  }
}
