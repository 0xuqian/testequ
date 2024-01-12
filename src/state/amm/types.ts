export interface State {
  data: {
    ammType: AmmType
  }
}

export const enum AmmType {
  /** 1: 32 */
  Default = 1,
  /** 1: 4 */
  SevenFive = 2,
  /** 1: 1 */
  Five = 3,
}
