import { useMemo } from 'react'

import { Interface } from '@ethersproject/abi'
import { Currency, Token, Pair } from '@pancakeswap/sdk'

import { useAppDispatch } from 'state'
import { changeAmmType } from 'state/amm/reducer'

import { CUSTOM_BASES } from 'config/constants/exchange'
import IPancakePairABI from 'config/abi/IPancakePair.json'

import { wrappedCurrency } from 'utils/wrappedCurrency'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PairState, usePairs } from 'hooks/usePairs'

import { useMultipleContractSingleData } from 'state/multicall/hooks'
import { AmmType } from 'state/amm/types'

const PAIR_INTERFACE = new Interface(IPancakePairABI)

const useDefaultAmm = ({
  currencyA,
  currencyB,
}: {
  currencyA: Currency
  currencyB: Currency
  noLiquidity: boolean
}) => {
  const { chainId } = useActiveWeb3React()

  const dispatch = useAppDispatch()

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB]
        ]
          .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
          .filter(([tokenA_, tokenB_]) => {
            if (!chainId) return true
            const customBases = CUSTOM_BASES[chainId]

            const customBasesA: Token[] | undefined = customBases?.[tokenA_.address]
            const customBasesB: Token[] | undefined = customBases?.[tokenB_.address]

            if (!customBasesA && !customBasesB) return true

            if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
            if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

            return true
          })
        : [],
    [tokenA, tokenB, chainId],
  )

  const allPairs = usePairs(allPairCombinations).filter((result): result is [PairState.EXISTS, Pair] => {
    return Boolean(result[0] === PairState.EXISTS && result[1])
  })

  const validPairAddresses = allPairs.map((result) => {
    return Pair.getAddress(result[1].token0, result[1].token1)
  })

  const exponentsResult = useMultipleContractSingleData(validPairAddresses, PAIR_INTERFACE, 'getExponents')

  exponentsResult.forEach((result, i) => {
    const { result: exponents, loading } = result

    if (loading) {
      return
    }

    if (!exponents) {
      return
    }

    const { exponent0, exponent1 } = exponents

    const decimalExponent0 = parseInt(exponent0, 10)
    const decimalExponent1 = parseInt(exponent1, 10)

    if ((decimalExponent0 === 32 && decimalExponent1 === 8) || (decimalExponent0 === 8 && decimalExponent1 === 32)) {
      dispatch(changeAmmType(AmmType.Default))
      return
    }
    if ((decimalExponent0 === 32 && decimalExponent1 === 1) || (decimalExponent0 === 1 && decimalExponent1 === 32)) {
      dispatch(changeAmmType(AmmType.OneThirtytwo))
      return
    }
    if (decimalExponent0 === 32 && decimalExponent1 === 32) {
      dispatch(changeAmmType(AmmType.OneOne))
    }
  })

  return undefined
}

export default useDefaultAmm
