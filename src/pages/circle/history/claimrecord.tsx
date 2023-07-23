import styled from "styled-components";
import Page from "views/Page";
import router from "next/router";
import { useTranslation } from "@pancakeswap/localization";
import CircleHeader from '../../../views/Circle/components/CircleHeader'


const LinkWrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  background: #ffff;
  padding: 0 16px;
`

export default function CircleHistory() {

  const {t} = useTranslation()
  return (
      <Page>
        <LinkWrapper>
          <CircleHeader backFn={() => router.push('/circle/history')} title={t('claim record')} Right={null} />
        </LinkWrapper>
      </Page>
  )
}