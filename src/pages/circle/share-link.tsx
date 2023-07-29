import router from "next/router"
import styled from "styled-components"
import CircleHeader from "views/Circle/components/CircleHeader"
import Page from "views/Page"
import { Button } from '@pancakeswap/uikit'
import useToast from "hooks/useToast";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from "@pancakeswap/localization"

const ListWrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  background: #ffff;
  padding: 0 20px 0 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const SelectButton = styled(Button)`
  margin: 40px 8px;
  width: 100%;
  max-width: 350px;
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
justify-content: center;
margin-top: 40px;
flex-wrap: wrap;
align-items: center;
text-align: center;
`;

const MintSucText = styled.text`
font-size: 20px;
padding-top: 40px;
font-weight: 800;
position: relative;
left : 7px;
text-align: center;
color: blue;
`
const CircleShare: React.FC<React.PropsWithChildren<{ projectAddress: string, leaderAddress: string }>> = ({ projectAddress, leaderAddress }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleCopy = () => {
    // setCopied(true);
    setTimeout(() => "", 2000);
    toastSuccess(t('Share link has been copied to clipboard'))
  };

  return (
    <Page>
      <ListWrapper>
        <LinkInner>
          <CircleHeader
            backFn={() => router.push('/circle/')}
            title={t('share_link')}
            Right={undefined}
          />
          <SuccessDiv>
            <Image src="/images/circle/checked.png" />
            <MintSucText>{t('Mint_success')}</MintSucText>
          </SuccessDiv>
          <>
            <CopyToClipboard
              text={`https://www.equityswap.club/circle/claim/${projectAddress}/${leaderAddress}`}
              onCopy={handleCopy}
            >
              <SelectButton
              // disabled={isDisabled}
              // onClick={}
              >{t('share_link')}</SelectButton>
            </CopyToClipboard>
          </>

        </LinkInner>
      </ListWrapper>
    </Page>
  )
}


export default CircleShare


