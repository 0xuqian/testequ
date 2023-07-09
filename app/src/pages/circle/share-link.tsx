import router from "next/router"
import styled from "styled-components"
import CircleHeader from "views/Circle/components/CircleHeader"
import Page from "views/Page"
import { useWeb3React } from '@web3-react/core'
import {Button} from '@pancakeswap/uikit'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react"

const ListWrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  background: #ffff;
  padding: 0 20px 0 16px;
`

const SelectButton = styled(Button)`
  margin: 40px 8px;
  width: 100%;
  max-width: 350px;
`

const List = styled.div`
  width: 100%;
  display: flex;
  height: 60px;
  flex-direction: column;
  flex-wrap: no-wrap;
  justify-content: space-between;
  align-items: center;
  // border-radius: 8px;
  // padding: 0 8px;
  &:hover {
    background: #e8e8e8;  
  }
`

const Image = styled.img`
  width: 40%;

`
const LinkInner = styled.div`
  flex: 1;
`

const SuccessDiv = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center
  margin-top: 40px;
  // align-content: center;
  flex-wrap: wrap;
  align-items: center;
`;

const MintSucText = styled.text`
  font-size:20px;
  padding-top: 40px;
  color: blue;
`
const CircleShare: React.FC<React.PropsWithChildren<{ projectAddress: string, leaderAddress:string }>> = ({ projectAddress,leaderAddress }) => {
  const {account} = useWeb3React()
  console.info(account)


  const handleCopy = () => {
    // setCopied(true);
    setTimeout(() => "", 2000);
    alert("链接已复制到剪贴板！");
  };



  return(
    <Page>
    <ListWrapper>
      <LinkInner>
        <CircleHeader
            backFn={() => router.push('/circle/')}
            title="Mint NFT 分享"
            Right={undefined}
        />
      <SuccessDiv>
        <Image src="/images/circle/check.png" />
        <MintSucText>mint成功</MintSucText>
      </SuccessDiv>
      {/* <CopyToClipboard text="gg" onCopy={() => {
                                              setCopied(`https://www.equityswap.club/circle/claim/${projectAddress}/${leaderAddress}`)
                                              setTimeout(() => setCopied(null), 2000)
                                            }} />
      <SelectButton
              // disabled={isDisabled}
              // onClick={}
          >分享链接</SelectButton> */}
           <>
      <CopyToClipboard
        text={`https://www.equityswap.club/circle/claim/${projectAddress}/${leaderAddress}`}
        onCopy={handleCopy}
      >
              <SelectButton
              // disabled={isDisabled}
              // onClick={}
          >分享链接</SelectButton> 
      </CopyToClipboard>
    </>

      </LinkInner>
      </ListWrapper>
    </Page>
  )
}


export default CircleShare