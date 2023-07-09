import router from "next/router"
import styled from "styled-components"
import CircleHeader from "views/Circle/components/CircleHeader"
import Page from "views/Page"
import { useWeb3React } from '@web3-react/core'
import {Button} from '@pancakeswap/uikit'

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
  console.log(account)

  const handleCopy = () => {
    // navigator.clipboard.writeText(`https://www.equityswap.club/circle/claim/${projectAddress}/${leaderAddress}`);
    // navigator.clipboard.writeText('gg')
    // alert("链接已复制到剪贴板！");
    navigator.clipboard.writeText(`https://www.equityswap.club/circle/claim/${projectAddress}/${leaderAddress}` )
    .then(() => {
      alert("链接已复制到剪贴板！");
    })
    .catch((error) => {
      console.error("剪贴板操作失败：", error);
    });
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
      <SelectButton
              // disabled={isDisabled}
              onClick={handleCopy}
          >分享链接</SelectButton>
      </LinkInner>
      </ListWrapper>
    </Page>
  )
}


export default CircleShare