import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'
import { SettingsMode } from '../Menu/GlobalSettings/types'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string | (() => void)
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<React.PropsWithChildren<Props>> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" width="100%" style={{ gap: '0' }}>
        {backTo &&
          (typeof backTo === 'string' ? (
            <Link passHref href={backTo}>
              <IconButton as="a" scale="sm">
                 <ArrowBackIcon width="22px" />
              </IconButton>
            </Link>
          ) : (
            <IconButton scale="sm" variant="text" onClick={backTo}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          ))}
        <Flex flexDirection="column" width="100%">
          <Flex mb="8px" alignItems="center" justifyContent="space-between">
            <Heading as="h2" style={{ fontSize: '18px' }}>
              {title}
            </Heading>
          </Flex>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text color="textSubtle" fontSize="12px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
