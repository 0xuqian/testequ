import styled from 'styled-components'
import { Flex, Text, TooltipText, useTooltip, Box, Link } from '@pancakeswap/uikit'

import { BalanceWithLoading } from 'components/Balance'
import { useTranslation } from '@pancakeswap/localization'
import { useIfoCredit, useIfoCeiling } from 'state/pools/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { getICakeWeekDisplay } from 'views/Pools/helpers'
import {BASE_BSC_SCAN_URL} from "../../../../../config";

const InlineLink = styled(Link)`
  display: inline;
`

const IfoCakeRow: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const credit = useIfoCredit()
  const ceiling = useIfoCeiling()
  const weeksDisplay = getICakeWeekDisplay(ceiling)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t(
          'The number of iCAKE equals the locked staking amount if the staking duration is longer than %weeks% weeks. If the staking duration is less than %weeks% weeks, it will linearly decrease based on the staking duration.',
          {
            weeks: weeksDisplay,
          },
        )}
      </Text>
      <InlineLink external href="https://www.peopleequity.club/doc">
        {t('Learn more about iCAKE')}
      </InlineLink>
    </Box>,
    {
      placement: 'bottom-start',
    },
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="textSubtle" bold fontSize="12px">
          {t('iCAKE')}
        </Text>
      </TooltipText>
      <BalanceWithLoading color="text" bold fontSize="16px" decimals={3} value={getBalanceNumber(credit)} />
    </Flex>
  )
}

export default IfoCakeRow
