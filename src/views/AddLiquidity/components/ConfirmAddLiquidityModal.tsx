import React, { useCallback } from 'react'
import styled from "styled-components";
import { Currency, CurrencyAmount, Fraction, Percent, Token, TokenAmount } from '@pancakeswap/sdk'
import { InjectedModalProps, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorBackToAddPageContent,
} from 'components/TransactionConfirmationModal'
import { Field } from 'state/burn/actions'
import { AmmType } from 'state/amm/types'
import { useAmmType } from 'state/amm/hooks'
import { AddLiquidityModalHeader, PairDistribution } from './common'

interface ConfirmAddLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity: boolean
  allowedSlippage: number
  liquidityErrorMessage: string
  price: Fraction
  myPrice: string
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  onAdd: () => void
  poolTokenPercentage: Percent
  liquidityMinted: TokenAmount
  currencyToAdd: Token
}

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #EB3DFF 0%, #5C53D3 100%);
  border-radius: 28px;
`

const ConfirmAddLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmAddLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  myPrice,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
}) => {
  const { t } = useTranslation()

  const ammType = useAmmType()

  const currencyAValue = parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)
  const currencyBValue = parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)

  let percent = 0.5

  if (ammType === AmmType.Five) {
    percent = 4 / 5
  }

  if (ammType === AmmType.SevenFive) {
    percent = 2 / 3
  }

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        myPrice={myPrice}
        noLiquidity={noLiquidity}
      >
        <PairDistribution
          title={t('Input')}
          percent={percent}
          currencyA={currencies[Field.CURRENCY_A]}
          currencyAValue={currencyAValue}
          currencyB={currencies[Field.CURRENCY_B]}
          currencyBValue={currencyBValue}
        />
      </AddLiquidityModalHeader>
    )
  }, [allowedSlippage, currencies, currencyAValue, currencyBValue, liquidityMinted, myPrice, noLiquidity, percent, poolTokenPercentage, price, t])

  const modalBottom = useCallback(() => {
    return (
      <StyledButton width="100%" onClick={onAdd} mt="20px">
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </StyledButton>
    )
  }, [noLiquidity, onAdd, t])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorBackToAddPageContent onDismiss={onDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', , '420px']}
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddLiquidityModal
