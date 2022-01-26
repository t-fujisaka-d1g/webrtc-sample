export class RoomName {
  static create(): string {
    return `${this.createCode(3)}-${this.createCode(4)}-${this.createCode(3)}`
  }

  private static createCode(len: number): string {
    const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let r = ''
    for (let num = 1; num <= len; num++) {
      r += c[Math.floor(Math.random() * c.length)]
    }
    return r
  }
}
