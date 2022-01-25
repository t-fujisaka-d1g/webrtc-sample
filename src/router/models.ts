import { Location } from 'vue-router'

export const RouteNames = {
  Login: 'Login',
  Home: 'Home',
  Sample1: 'Sample1',
  Sample2: 'Sample2',
  Sample3: 'Sample3',
} as const
export type RouteName = typeof RouteNames[keyof typeof RouteNames]

export class RouteLocations {
  static toLogin(): Location {
    return {
      name: RouteNames.Login,
    }
  }
  static toHome(apiKey: string): Location {
    return {
      name: RouteNames.Home,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample1(apiKey: string): Location {
    return {
      name: RouteNames.Sample1,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample2(apiKey: string): Location {
    return {
      name: RouteNames.Sample2,
      params: {
        apiKey: apiKey,
      },
    }
  }
  static toSample3(apiKey: string): Location {
    return {
      name: RouteNames.Sample3,
      params: {
        apiKey: apiKey,
      },
    }
  }
}
