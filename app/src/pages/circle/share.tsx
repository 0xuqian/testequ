import styled from "styled-components";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { Button } from '@pancakeswap/uikit'
import BigNumber from "bignumber.js";
import { ethers } from 'ethers';
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useTranslation } from "@pancakeswap/localization";
import useToast from "hooks/useToast";
import { ToastDescriptionWithTx } from "components/Toast";
import { NFTsInfo } from "config/constants/equityNFTs"
import { useCircleProjectInfo } from "../../hooks/useCircleProject";
import Page from '../../views/Page'
import CircleHeader from '../../views/Circle/components/CircleHeader'
import TokenTransferAbi from '../../config/abi/TokenTransfer_metadata.json'

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;

`;

const ProjectSelect = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  // color: #15141f;
  &.loading {
    color: #e6e6e6;
  }
`

const CurrentProject = styled.div`
  margin-top: 12px;
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid #e7e8f3;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  padding: 0 12px 0 16px;
  align-items: center;
`

const ProjectAvatar = styled(Image)`
  margin-right: 10px;
  width: 32px;
  height: 32px;
`;

const ProjectToken = styled.div``;

const ProjectPrice = styled.div`
  display: flex;
  align-items: center;
`;

const ProjectPriceValue = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 26px;
  // color: #15141f;
  margin-right: 2px;
`;

const ToArrow = styled(Image)`
  width: 16px;
  height: 16px;
`;

const LinkWrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 0 16px;
  border-radius: 20px
`

const ProjectTokenName = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  // color: #15141f;
  margin-left: 5px;
`

const LinkInner = styled.div`
  flex: 1;
`

const Input = styled.input`
font-family: 'PingFang SC';
font-style: normal;
cursor: pointer;
font-weight: 500;
margin-top: 12px;
width: 100%;
height: 60px;
background: ${({ theme }) => theme.colors.backgroundAlt};
border: 1px solid #e7e8f3;
border-radius: 12px;
display: flex;
justify-content: space-between;
padding: 0 12px 0 16px;
align-items: center;
text-align: right;
font-size: 16px
`;

const SelectButton = styled(Button)`
  margin: 40px 8px;
  width: 100%;
  max-width: 350px;
`

const InputLabel = styled.span`
  position: relative;
  font-weight: 400;
  font-family: 'PingFang SC';
  top: 50px;
  left: 25px;
`;

const CircleShare: React.FC<React.PropsWithChildren<{ projectAddress: string }>> = ({ projectAddress }) => {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const router = useRouter()
  const [amount, setAmount] = useState('');
  const [minting, isMinting] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { library, chainId, account } = useActiveWeb3React()

  const handleInputChange = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let { value } = event.target;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 500)) {
      setAmount(value);
    } else {
      value = Number(value);
      if (value > 500) {
        value = 500;
      }
      setAmount(value.toString());
    }
  };


  useEffect(() => {
    setIsDisabled(amount === '' || parseInt(amount, 10) === 0);
  }, [amount]);


  const { project } = useCircleProjectInfo(projectAddress)

  const handleWheel = (event) => {
    event.preventDefault();
  };

  const updateToServerMintInfo = async () => {

    try {
      const body = JSON.stringify({
        addr: account,
        amount: parseInt(amount, 10),
        net: account ? `evm--${Number(chainId)}` : `evm--97`,
      });

      const response = await fetch("https://www.equityswap.club/app/user/mint_nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      console.info(response)
    } catch (error) {
      console.info(error);
    }
  };

  const handleMint = async () => {
    setIsDisabled(true)

    const accounts = await library.provider.request({ method: "eth_requestAccounts" });
    const accountAddress = accounts[0];
    const signer = library.getSigner();
    const overrides = {
      value: ethers.utils.parseUnits((Number(amount) * NFTsInfo.MintPrice).toString(), 'ether')
    }
    const contract = new ethers.Contract(NFTsInfo.BatchMintContract, TokenTransferAbi, signer);

    try {
      isMinting(true)
      const tx = await contract.mintNfts(NFTsInfo.NFTsContract, projectAddress, accountAddress, amount, overrides);
      const receipt = await tx.wait();


      if (receipt?.status) {
        await updateToServerMintInfo();
        toastSuccess(
          `${t('Mint_success')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your nft was minted successfully')}
          </ToastDescriptionWithTx>,
        )
        isMinting(false)
        setIsDisabled(false)
        router.push(`/circle/share-link/${projectAddress.toLowerCase()}/${account.toLowerCase()}`)
      }
    } catch (error: any) {
      setIsDisabled(false)
      isMinting(false)

      if (error.data && error.data.message) {
        if (error.data.message.includes("insufficient funds for gas")) {
          toastError(t('failed_to_mint'), t('insuff_fund_gas'));
        }
      } else if (error.message && error.message.includes("User denied transaction signature")) {
        toastError(t('failed_to_mint'), t('User denied transaction signature'));
      } else {
        toastError(t('failed_to_mint'), t('Unknown error'));
      }
    }
  }

  return (
    <>
      <Page>
        <LinkWrapper>
          <LinkInner>
            <CircleHeader
              backFn={() => router.push('/circle/link')}
              title={t('Mint')} Right={undefined}
            />
            <InputLabel>{t('people')}</InputLabel>
            <Input
              type="number"
              value={amount}
              onChange={handleInputChange}
              min={0}
              max={500}
              onWheel={handleWheel}
              placeholder={t('mint_limit_text')}
            />

            {/* <LinkSwitch /> */}
            <CurrentProject >
              {
                project ?
                  <>
                    <ProjectInfo>
                      <ProjectAvatar width={32} height={32} src={project?.icon} />
                      <ProjectToken>
                        <ProjectTokenName>{project?.symbol}</ProjectTokenName>
                      </ProjectToken>
                    </ProjectInfo>
                    <ProjectPrice>
                      <ProjectPriceValue>{new BigNumber(project?.price).toFixed(2)}</ProjectPriceValue>
                    </ProjectPrice>
                  </> :
                  <>
                    <ProjectInfo>
                      <ProjectToken>
                        <ProjectSelect> </ProjectSelect>
                      </ProjectToken>
                    </ProjectInfo>
                    <ProjectPrice>
                      <ToArrow width={16} height={16} src='/images/circle/arrow.png' />
                    </ProjectPrice>
                  </>
              }
            </CurrentProject>
            <SelectButton
              disabled={isDisabled}
              onClick={handleMint}
            >{minting ? t('Minting...') : t('Mint')}
            </SelectButton>
          </LinkInner>
        </LinkWrapper>
      </Page>
    </>
  );
}

export default CircleShare

