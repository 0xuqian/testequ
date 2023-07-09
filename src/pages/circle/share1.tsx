import styled from "styled-components";
import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import {Button} from '@pancakeswap/uikit'
import BigNumber from "bignumber.js";
import { ethers } from 'ethers';
import { useCircleProjectInfo} from "../../hooks/useCircleProject";
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
  color: #15141f;
  &.loading {
    color: #e6e6e6;
  }
`

const CurrentProject = styled.div`
  cursor: pointer;
  margin-top: 12px;
  width: 100%;
  height: 60px;
  background: #FFFFFF;
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
  color: #15141f;
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
  background: #ffff;
  padding: 0 16px;
`

const ProjectTokenName = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  color: #15141f;
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
background: #FFFFFF;
border: 1px solid #e7e8f3;
border-radius: 12px;
display: flex;
justify-content: space-between;
padding: 0 12px 0 16px;
align-items: center;
text-align: right;
font-size: 15px
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
  const router = useRouter()
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
    

  // const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
  //   const inputValue = event.currentTarget.value;
  //   const parsedValue = parseInt(inputValue, 10);
  //   if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
  //     setValue(inputValue);
  //   }
  // };

  const handleInputChange = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let {value} = event.target;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 200)) {
      setValue(value);
    }else {
      value = Number(value);
      if (value > 200) {
        value = 200;
      }
      setValue(value.toString());
    }
  };
  

  useEffect(() => {
    setIsDisabled(value === '' || parseInt(value, 10) === 0);
  }, [value]);


  const { project } = useCircleProjectInfo(projectAddress)
  
  const handleWheel = (event) => {
    event.preventDefault(); 
  };

  const handleMint = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const accountAddress = accounts[0];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0xecB698B980ab2279Fb179a9E54Afbf79B21DF0a3", TokenTransferAbi, signer);
    const tx = await contract.mintNfts("0x45a938E690709B8c9C34D18487Aa56251d088E2a","0xD6e8024e4572d954371c9f95acf33c65947233C9",accountAddress,ethers.BigNumber.from(value));
    const receipt1 = await tx.wait();
  }
  return (
    <>     
       <Page>
        <LinkWrapper>
          <LinkInner>
            <CircleHeader
              // width = 
              backFn={() => router.push('/circle/link')}
              title="Mint NFT 分享" Right={undefined}
            />
              <InputLabel>人数</InputLabel>
             <Input
              type="number"
              value={value}
              onChange={handleInputChange}
              min={0}
              max={200}
              onWheel={handleWheel}
              placeholder="0个起步, 最多200"
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
                        <ToArrow width={16} height={16} src='/images/circle/arrow.png'/>
                      </ProjectPrice>
                    </>
              }
            </CurrentProject>
            <SelectButton
              disabled={isDisabled}
              onClick={handleMint}
          >Mint</SelectButton>
          </LinkInner>
        </LinkWrapper>
      </Page>
    </>
  );
}

export default CircleShare