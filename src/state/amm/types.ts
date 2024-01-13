export interface State {
  data: {
    ammType: AmmType
  }
}

export const enum AmmType {
  /** 1: 4 */
  Default = 1,
  /** 1: 32 */
  OneThirtytwo = 2,
  /** 1: 1 */
  OneOne = 3,
}
