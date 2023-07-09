import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {Button} from '@pancakeswap/uikit'
import { ethers } from 'ethers';
import Page from '../../views/Page'
import CircleHeader from '../../views/Circle/components/CircleHeader'
import HandNftAbi from '../../config/abi/HandNft_metadata.json'

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

const SelectButton = styled(Button)`
  margin: 40px 8px;
  width: 100%;
  max-width: 350px;
`

const LinkInner = styled.div`
  flex: 1;
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

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 18px
`;

const ProjectTitle = styled.div`
  margin: 25px 0;
  font-size: 15px
`
export default function CircleList() {
  
  const router = useRouter()

  const [projectAddress, setProjectAddress] = useState('');
  const [communityAddress, setCommunityAddress] = useState('');
  
  const handleProjectAddressChange = (event) => {
    setProjectAddress(event.target.value);
  };

  const isDisabled = !projectAddress || !communityAddress;

  const handleCommunityAddressChange = (event) => {
    setCommunityAddress(event.target.value);
  };

  const handleTransfer = () => {
    // var accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    // const accountAddress = accounts[0];
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract("0x45a938E690709B8c9C34D18487Aa56251d088E2a", HandNftAbi, signer);
    // const tx = await contract.claim("0x45a938E690709B8c9C34D18487Aa56251d088E2a","0xD6e8024e4572d954371c9f95acf33c65947233C9",accountAddress,ethers.BigNumber.from(value));
    // const receipt1 = await tx.wait();
    console.log(receipt1);
  }
  return (
    <>     
        <Page>
          <LinkWrapper>
            <LinkInner>
            <CircleHeader
              // width = 
              backFn={() => router.push('/circle/')}
              title="领取NFT" Right={undefined}
            />
            <ProjectTitle>请选择项目地址</ProjectTitle>
            <CurrentProject>
            <Input
              type="text"
              value={projectAddress}
              onChange={handleProjectAddressChange}
              style={{
                textAlign: 'right',
             }}
           />
            </CurrentProject>
            <ProjectTitle>社区长钱包地址</ProjectTitle>
            <CurrentProject>
            <Input
              type="text"
              value={communityAddress}
              onChange={handleCommunityAddressChange}
              style={{
                textAlign: 'right',
             }}
           />
            </CurrentProject>
            </LinkInner>
            <SelectButton
              disabled={isDisabled}
              onClick={handleTransfer}
          >领取</SelectButton>
          </LinkWrapper>
          </Page>
    </>
        )
} 