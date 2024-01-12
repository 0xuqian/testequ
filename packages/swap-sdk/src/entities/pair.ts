import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Price } from './fractions/price'
import { TokenAmount } from './fractions/tokenAmount'

import {
  BigintIsh,
  FACTORY_ADDRESS_MAP,
  INIT_CODE_HASH_MAP,
  MINIMUM_LIQUIDITY,
  ZERO,
  ONE,
  FIVE,
  FEES_NUMERATOR,
  FEES_DENOMINATOR,
  ChainId,
} from '../constants'
import { sqrt, parseBigintIsh } from '../utils'
import { InsufficientReservesError, InsufficientInputAmountError } from '../errors'
import { Token } from './token'

let PAIR_ADDRESS_CACHE: { [key: string]: string } = {}

const composeKey = (token0: Token, token1: Token) => `${token0.chainId}-${token0.address}-${token1.address}`

export class Pair {
  public readonly liquidityToken: Token

  private readonly tokenAmounts: [TokenAmount, TokenAmount]

  public exponent0: String = '32'

  public exponent1: String = '32'

  public setExponents(_exponent0: String, _exponent1: String) {
    this.exponent0 = _exponent0
    this.exponent1 = _exponent1
  }

  public static getAddress(tokenA: Token, tokenB: Token): string {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

    const key = composeKey(token0, token1)

    if (PAIR_ADDRESS_CACHE?.[key] === undefined) {
      PAIR_ADDRESS_CACHE = {
        ...PAIR_ADDRESS_CACHE,
        [key]: getCreate2Address(
          FACTORY_ADDRESS_MAP[token0.chainId],
          keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
          INIT_CODE_HASH_MAP[token0.chainId]
        ),
      }
    }
    return PAIR_ADDRESS_CACHE[key]
  }

  public constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    this.liquidityToken = new Token(
      tokenAmounts[0].token.chainId,
      Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token),
      18,
      'PE-LP',
      'EquitySwap LPs'
    )
    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price {
    return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price {
    return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].token
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token
  }

  public get reserve0(): TokenAmount {
    return this.tokenAmounts[0]
  }

  public get reserve1(): TokenAmount {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public exponentOf(token: Token): String {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.exponent0 : this.exponent1
  }

  // eslint-disable-next-line class-methods-use-this
  public floorSqrt(n: JSBI): JSBI {
    if (JSBI.GT(n, 0)) {
      let x: JSBI = JSBI.add(JSBI.divide(n, JSBI.BigInt(2)), JSBI.BigInt(1))
      let y: JSBI = JSBI.divide(JSBI.add(x, JSBI.divide(n, x)), JSBI.BigInt(2))
      while (JSBI.GT(x, y)) {
        x = JSBI.add(y, JSBI.BigInt(0))
        y = JSBI.divide(JSBI.add(x, JSBI.divide(n, x)), JSBI.BigInt(2))
      }
      return x
    }
    return JSBI.BigInt(0)
  }

  // eslint-disable-next-line class-methods-use-this
  public floorCbrt(n: JSBI): JSBI {
    let x: JSBI = JSBI.BigInt(0)
    for (
      let y = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(255));
      JSBI.GT(y, JSBI.BigInt(0));
      y = JSBI.divide(y, JSBI.BigInt(8))
    ) {
      x = JSBI.multiply(x, JSBI.BigInt(2))
      let z: JSBI = JSBI.add(
        JSBI.multiply(JSBI.multiply(JSBI.BigInt(3), x), JSBI.add(x, JSBI.BigInt(1))),
        JSBI.BigInt(1)
      )
      if (JSBI.GE(JSBI.divide(n, y), z)) {
        n = JSBI.subtract(n, JSBI.multiply(y, z))
        x = JSBI.add(x, JSBI.BigInt(1))
      }
    }
    return x
  }

  public calculateProduct(n, a, b, decimal): JSBI {

  }

  public exp(n: JSBI, a: number, b: number): JSBI {
    const decimal = 38
    const decimal2 = 77
    if (a === b) {
      // console.info("1:1")
      return n
    }
    // console.info(a, b)
    // 扩充到48位
    if (a === 32 && b === 8) {
      // console.info("4:1")
      n = JSBI.divide(JSBI.multiply(JSBI.multiply(n, n), JSBI.multiply(n, n)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal2)))
    } else if ((a === 32 && b === 1)) {
      // console.info("32:1")
      const pow64 = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal));
      let q = n;
      for (let i = 0; i < 31; i++) {
        q = JSBI.divide(JSBI.multiply(q, n), pow64);
      }
      // n = JSBI.divide(JSBI.multiply(q, n), pow64)
      return q
    } else if (a === 1 && b === 32) {
      // console.info("1:32")
      let result = n;
      for (let i = 0; i < 5; i++) {
        const exponent = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal));
        result = JSBI.multiply(result, exponent);
        result = this.floorSqrt(result);
      }
      return result;
    } else if (a === 8 && b === 32) {
      // console.info("1:4")
      n = this.floorSqrt(this.floorSqrt(JSBI.multiply(n, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal2)))))
    }
    return n
  }

  public cpoy2Exp(n: JSBI, a: number, b: number): JSBI {
    const decimal = 38
    const decimal2 = 77
    if (a == b) {
      return n
    }
    a = a / 32
    b = b / 32
    // 扩充到48位
    if ((a == 1 && b == 4) || (a == 2 && b == 4)) {
      n = this.floorSqrt(JSBI.multiply(n, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal))))
    } else if ((a == 2 && b == 1) || (a == 4 && b == 2)) {
      n = JSBI.divide(JSBI.multiply(n, n), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal)))
    } else if (a == 4 && b == 1) {
      n = JSBI.divide(JSBI.multiply(JSBI.multiply(n, n), JSBI.multiply(n, n)), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal2)))
    } else if (a == 1 && b == 4) {
      n = this.floorSqrt(this.floorSqrt(JSBI.multiply(n, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal2)))))
    }
    return n
  }

  public copyExp(n: JSBI, a: number, b: number, decimal: number): JSBI {
    if (a == b) {
      return n
    }
    a = a / 25
    b = b / 25
    // 扩充到48位
    n = JSBI.multiply(n, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(48 - decimal)))
    if (b == 2) {
      n = this.floorSqrt(n)
    } else if (b == 3) {
      n = this.floorCbrt(n)
    } else if (b == 4) {
      n = this.floorSqrt(this.floorSqrt(n))
    }
    n = JSBI.exponentiate(n, JSBI.BigInt(a))
    return JSBI.divide(n, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt((48 * a) / b - decimal)))
  }

  public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(inputAmount.token), 'TOKEN')
    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError()
    }
    console.info("inputAmount:", inputAmount)
    const inputReserve = this.reserveOf(inputAmount.token)
    const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const inputExponent = this.exponentOf(inputAmount.token)
    const outputExponent = this.exponentOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    console.log('----------------------')
    console.log('outputToken:', JSBI.toNumber(outputReserve.raw))
    console.log('inputReserve:', JSBI.toNumber(inputReserve.raw))
    console.log('outputReserve:', JSBI.toNumber(outputReserve.raw))
    console.log('inputExponent:', inputExponent)
    console.log('outputExponent:', outputExponent)
    console.log('inputAmount', JSBI.toNumber(inputAmount.raw))

    // Fees I*F_N/F_D  
    const inputAmountWithFee = JSBI.divide(JSBI.multiply(inputAmount.raw, FEES_NUMERATOR), FEES_DENOMINATOR)
    const outputDecimals = inputAmount.token.equals(this.token0) ? this.token1.decimals : this.token0.decimals
    const K = JSBI.multiply(
      this.exp(inputReserve.raw, +inputExponent, 32, inputAmount.currency.decimals),
      this.exp(outputReserve.raw, +outputExponent, 32, outputDecimals)
    )
    const X = this.exp(
      JSBI.add(inputReserve.raw, inputAmountWithFee),
      +inputExponent,
      32,
      inputAmount.currency.decimals
    )
    const tmp = this.exp(JSBI.divide(K, X), 32, +outputExponent, outputDecimals)

    if (JSBI.LE(JSBI.BigInt(outputReserve.raw), tmp)) {
      throw new InsufficientInputAmountError()
    }
    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.subtract(JSBI.BigInt(outputReserve.raw), tmp)
    )
    console.info('result:', JSBI.toNumber(JSBI.subtract(JSBI.BigInt(outputReserve.raw), tmp)))
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(outputAmount.token), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.token)
    const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const outputExponent = this.exponentOf(outputAmount.token)
    const inputExponent = this.exponentOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    // console.log('inputReserve:', JSBI.toNumber(inputReserve.raw))
    // console.log('outputReserve:', JSBI.toNumber(outputReserve.raw))
    // console.log('inputExponent:', inputExponent)
    // console.log('outputExponent:', outputExponent)
    // console.log('outputAmount', JSBI.toNumber(outputAmount.raw))
    const inputDecimals = outputAmount.token.equals(this.token0) ? this.token1.decimals : this.token0.decimals
    const K = JSBI.multiply(
      this.exp(inputReserve.raw, +inputExponent, 32, inputDecimals),
      this.exp(outputReserve.raw, +outputExponent, 32, outputAmount.token.decimals)
    )
    const Y = this.exp(
      JSBI.subtract(outputReserve.raw, outputAmount.raw),
      +outputExponent,
      32,
      outputAmount.currency.decimals
    )
    const tmp = this.exp(JSBI.divide(K, Y), 32, +inputExponent, inputDecimals)
    if (JSBI.LT(tmp, JSBI.BigInt(inputReserve.raw))) {
      throw new InsufficientInputAmountError()
    }
    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(
        JSBI.multiply(JSBI.subtract(tmp, JSBI.BigInt(inputReserve.raw)), JSBI.BigInt(FEES_DENOMINATOR)),
        FEES_NUMERATOR
      )
    )
    console.log(
      'result:',
      JSBI.toNumber(
        JSBI.divide(
          JSBI.multiply(JSBI.subtract(tmp, JSBI.BigInt(inputReserve.raw)), JSBI.BigInt(FEES_DENOMINATOR)),
          FEES_NUMERATOR
        )
      )
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: TokenAmount,
    tokenAmountA: TokenAmount,
    tokenAmountB: TokenAmount
  ): TokenAmount {
    invariant(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return new TokenAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: TokenAmount,
    liquidity: TokenAmount,
    feeOn: boolean = false,
    kLast?: BigintIsh
  ): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY')

    let totalSupplyAdjusted: TokenAmount
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = parseBigintIsh(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return new TokenAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw)
    )
  }
}
