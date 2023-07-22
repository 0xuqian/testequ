import styled, { useTheme } from 'styled-components'
import {useRouter} from "next/router";
import { useTranslation } from '@pancakeswap/localization';
import { useHistoryNftInfo } from 'hooks/useHistoryNftInfo';
import { useEffect, useState } from 'react';
import CircleHeader from './components/CircleHeader'
import Page from '../Page'
import ProjectInfo from './components/ProjectsInfo';
import Skeleton from "../../../packages/uikit/src/components/Skeleton/Skeleton";


const SkeletonP = styled(Skeleton)`
 width: 100%;
 height 60px;
`

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

const Line = styled.div`
  width: calc(100% - 16px);
  height: 1px;
  background: #efefef;
  transform: scaleY(0.5);
  margin-left: 8px;
`


export default function CircleHistory() {

  const [network,setNetwork] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()
  const data = useHistoryNftInfo(setNetwork)

  return (
      <Page>
        <LinkWrapper>
          <CircleHeader backFn={() => router.push('/circle/link')} title={t('History')} Right={null} />
          {data !== null || network === false ? (data?.data.all_nft_his.map((item) => (
          <ProjectInfo key={item.pro_addr} projectInfo={item}/>
        ))) : <SkeletonP/>}
          <Line />
        </LinkWrapper>
      </Page>
  )
}
