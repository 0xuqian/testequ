import { Currency, Pair, Token } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from '@pancakeswap/uikit'
import styled, { css, useTheme } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import {background, border} from "styled-system";
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  padding-top: 8px;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;

  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      // background: ${theme.colors.background};
      // border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  padding-top: 8px;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean; isDark?: boolean  }>`
  /*border: 1px solid ${({ theme }) => theme.colors.inputCat};*/
  border-radius: ${({ theme }) => theme.radii.default};
  /*background-color: ${({ theme }) => theme.colors.input};*/
  border: ${({isDark}) => isDark ? '1px solid #372F47' : '1px solid #f6f5fe' };
  background-color: ${({isDark}) => isDark ? '#372F47' : '#f6f5fe' };
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
`

const StyledText = styled(Text)`
  height: 18px;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
  labelType?: string
  noLiquidity?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  disabled,
  error,
  showBUSD,
  labelType,
  noLiquidity,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDark } = useTheme()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null
  const theme = useTheme()

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box position="relative" id={id}>
      {noLiquidity ? (
        <StyledText style={{ fontSize: '12px', marginBottom: '2px' }}>
          {label === 'X' ? t('tokensIssued') : label === 'Y' ? t('tokensRaised') : ''}
        </StyledText>
      ) :
          <StyledText style={{ fontSize: '12px', marginBottom: '2px' }}>
            {' '}
          </StyledText>
      }
      <Flex alignItems="center" justifyContent="space-between" style={{ display: 'none' }}>
        {account && (
          <Text
            onClick={!disabled && onMax}
            color="textSubtle"
            fontSize="14px"
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error} isDark={isDark}>
          {labelType === 'swap' ? (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 12px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '14px' }}>{label}</Text>
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="14px"
                  title={!hideBalance && !!currency
                      ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                      : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          ) : labelType === 'swap-balance' ? (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 12px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '14px' }}>{label}</Text>
              {/* <Text>balance</Text> */}
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="14px"
                  title={!hideBalance && !!currency
                      ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                      : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          ) : (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 15px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '12px' }}>INPUT</Text>
              {/* <Text>balance: </Text> */}
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="14px"
                  title={!hideBalance && !!currency
                      ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                      : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          )}
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              style={{ textAlign: 'left', fontSize: '20px', color: theme.colors.inputCat }}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
            {/* <Text style={{border: '2px solid #4B5860', padding: '0 8px', borderRadius: '15px', fontSize: '12px'}}>MAX</Text> */}
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button
                onClick={onMax}
                scale="xs"
                variant="secondary"
                style={{
                  color: theme.colors.inputCat,
                  border: `1px solid ${theme.colors.inputCat}`
                }}
              >
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
            <Flex>
              {beforeButton}
              <CurrencySelectButton
                zapStyle={zapStyle}
                className="open-currency-select-button"
                selected={!!currency}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    onPresentCurrencyModal()
                  }
                }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '8px' }} />
                  ) : null}
                  {pair ? (
                    <Text id="pair" bold style={{ fontSize: '12px' }}>
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </Text>
                  ) : (
                    <Text id="pair" bold style={{ fontSize: '12px' }}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length,
                          )}`
                        : currency?.symbol) || t('Select a currency')}
                    </Text>
                  )}
                  {!disableCurrencySelect && <ChevronDownIcon />}
                </Flex>
              </CurrencySelectButton>
              {/* {token && tokenAddress ? (
                <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
                  <CopyButton
                    width="16px"
                    buttonColor="textSubtle"
                    text={tokenAddress}
                    tooltipMessage={t('Token address copied')}
                    tooltipTop={-20}
                    tooltipRight={40}
                    tooltipFontSize={12}
                  />
                  <AddToWalletButton
                    variant="text"
                    p="0"
                    height="auto"
                    width="fit-content"
                    tokenAddress={tokenAddress}
                    tokenSymbol={token.symbol}
                    tokenDecimals={token.decimals}
                    tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
                  />
                </Flex>
              ) : null} */}
            </Flex>
          </LabelRow>
          {/* <InputRow selected={disableCurrencySelect}>
            {!!currency && showBUSD && Number.isFinite(amountInDollar) && (
              <Text fontSize="12px" color="textSubtle" mr="12px">
                ~{formatNumber(amountInDollar)} USD
              </Text>
            )}
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow> */}
        </Container>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}
