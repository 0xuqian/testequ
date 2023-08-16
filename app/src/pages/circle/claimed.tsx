import router from "next/router"
import styled from "styled-components"
import CircleHeader from "views/Circle/components/CircleHeader"
import Page from "views/Page"
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTranslation } from "@pancakeswap/localization"
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
  background: ${({ theme }) => theme.colors.backgroundAlt};
`
const ClaimSuccCapWrapper = styled.div`
  width: 100%;
  height: 70px;
  margin-top :25px;
`
const ClaimSuccInfo = styled.div`
  width: 100%
  display: flex;
  justify-content: space-between;
  height: 100%;
  
`

const ClaimSuccDetail = styled.div`
  height: 35px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  line-height: 35px; 
`


const Image = styled.img`
  width: 30%;
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
margin-top: 20px;
flex-wrap: wrap;
align-items: center;
text-align: center;
`;

const MintSucText = styled.p`
font-size: 20px;
margin-top: 30px;
font-weight: 800;
text-align: center;
color: blue;
`

const ContracDetails = styled.div`
  height: 35px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ContractPasteDiv = styled.div`
  display: flex;
  width: 50%;
  height: 100%;
  // background: black;
  line-height: 35px;
  font-size : 15px;
  justify-content: end;
`

const CopyButton = styled.div`
  cursor: pointer;
  width: 16px;
  height: 16px;
  background: url('/images/dcs/copy.png');
  background-size: 16px;
  margin-left: 8px;
`

const CopyWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

`

const Tooltip = styled.div<{
  isTooltipDisplayed: boolean
}>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline' : 'none')};
  position: absolute;
  padding: 4px;
  top: -2px;
  right: -50px;
  text-align: center;
  font-size: 12px;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: max-content;
`


const Claimed: React.FC<React.PropsWithChildren<{ projectAddress: string, nftId: string }>> = ({ projectAddress = '0xc2452DB583AFB353cB44Ac6edC2f61Da7C23A8bB', nftId = "0" }) => {

  const { t } = useTranslation()
  const [copy, setCopied] = useState("")
  const [shortAddress, setShortAddress] = useState("")

  useEffect(() => {
    const simplifyAddress = () => {
      const prefix = projectAddress.substring(0, 6);
      const suffix = projectAddress.substring(projectAddress.length - 6);
      setShortAddress(`${prefix}...${suffix}`);
    }
    simplifyAddress();
  }, [projectAddress])

  return (
    <Page>
      <ListWrapper>
        <LinkInner>
          <CircleHeader
            backFn={() => router.push('/circle/')}
            title={t('NFT Details')}
            Right={undefined}
          />
          <SuccessDiv>
            <Image src="/images/circle/checked.png" />
            <MintSucText>{t('Claim_success')}</MintSucText>
            <ClaimSuccCapWrapper>
              <ClaimSuccInfo>
                <ClaimSuccDetail>
                  <ContracDetails>
                    {t('contract address')}
                  </ContracDetails>
                  <ContractPasteDiv>
                    {shortAddress}
                    <CopyToClipboard text={projectAddress} onCopy={() => {
                      setCopied(projectAddress)
                      setTimeout(() => setCopied(null), 2000)
                    }}>
                      <CopyWrapper onClick={(e) => {
                        e.stopPropagation()
                      }}>
                        <CopyButton />
                        <Tooltip isTooltipDisplayed={copy === projectAddress}>{t('Copied')}</Tooltip>
                      </CopyWrapper>
                    </CopyToClipboard>
                  </ContractPasteDiv>
                </ClaimSuccDetail>
                <ClaimSuccDetail>
                  <ContracDetails>
                    Token ID
                  </ContracDetails>
                  <ContractPasteDiv>
                    {nftId}
                    <CopyToClipboard text={nftId} onCopy={() => {
                      setCopied(nftId)
                      setTimeout(() => setCopied(null), 2000)
                    }}>
                      <CopyWrapper onClick={(e) => {
                        e.stopPropagation()
                      }}>
                        <CopyButton />
                        <Tooltip isTooltipDisplayed={copy === nftId}>{t('Copied')}</Tooltip>
                      </CopyWrapper>
                    </CopyToClipboard>
                  </ContractPasteDiv>
                </ClaimSuccDetail>
              </ClaimSuccInfo>
            </ClaimSuccCapWrapper>
          </SuccessDiv>
          <>
          </>
        </LinkInner>
      </ListWrapper>
    </Page>
  )
}


export default Claimed;
