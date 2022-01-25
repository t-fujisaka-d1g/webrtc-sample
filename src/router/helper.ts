import { RouteLocations } from '@/router/models'
import { Location, Route } from 'vue-router'
import router from '@/router/index'

export class RouterHelper {
  static moveHome(apiKey: string): Promise<Route> {
    const to = RouteLocations.toHome(apiKey)
    return this.moveLocation(to)
  }

  private static async moveLocation(to: Location): Promise<Route> {
    return await router.push(to)
  }
}
