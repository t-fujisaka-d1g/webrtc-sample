import { Location } from 'vue-router'

export const RouteNames = {
  Home: 'Home',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]

export class RouteLocations {
  static toHome(): Location {
    return {
      name: RouteNames.Home,
    }
  }
}
