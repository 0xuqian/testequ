import styled from 'styled-components'
import {
  Flex,
  Heading,
  HistoryIcon,
  NotificationDot,
  IconButton,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import { GlobalSettings } from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import useTheme from 'hooks/useTheme'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const ChartImg = styled.img`
  width: 28px;
  height: 30px;
  cursor: pointer;
  position: relative;
  bottom: 1px;
`

const CurrencyInputContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const { isDark } = useTheme()
  const getStrokeColor = () => isDark ? "#FFFFFF" : "#333333";
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const router = useRouter()
  return (
    <CurrencyInputContainer>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        {/* {setIsChartDisplayed && (
          <ColoredIconButton onClick={toggleChartDisplayed} variant="text" scale="sm">
            {isChartDisplayed ? <ChartDisableIcon color="textSubtle" /> : <ChartIcon width="24px" color="textSubtle" />}
          </ColoredIconButton>
        )} */}
        <Flex flexDirection="column" alignItems="flex-start" width="100%" mr={0}>
          <Heading as="h2">{title}</Heading>
          <Text color="textSubtle" fontSize="14px">
            {subtitle}
          </Text>
        </Flex>
        <Flex>
          <></>
          <IconButton variant="text" scale="sm">
            <ChartImg onClick={() => router.push('/trading-view')} src='/images/kchart.png' alt='gg' />
          </IconButton>
          <NotificationDot show={expertMode}>
            <GlobalSettings color={getStrokeColor()} mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
          </NotificationDot>
          <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
            <HistoryIcon width="20px" stroke={getStrokeColor()} />
          </IconButton>
          <IconButton variant="text" scale="sm" onClick={handleOnClick}>
            <RefreshIcon disabled={!hasAmount} width="22px" stroke={getStrokeColor()} />
          </IconButton>
        </Flex>
      </Flex>
      {/* <Flex alignItems="center">
        <Text color="textSubtle" fontSize="14px">
          {subtitle}
        </Text>
      </Flex> */}
    </CurrencyInputContainer >
  )
}

export default CurrencyInputHeader
