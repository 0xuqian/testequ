import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {Button} from '@pancakeswap/uikit'
import { ethers } from 'ethers';
import useActiveWeb3React from 'hooks/useActiveWeb3React'
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
  height: 80%;
  outline: none;
  border: none;
  background: transparent;
  text-align: right;
  font-size: 15px
`;

const ProjectTitle = styled.div`
  margin: 25px 0;
  font-size: 15px
`
const CircleClaim: React.FC<React.PropsWithChildren<{ projectAddr: string, leaderAddress:string }>> = () => {
  
  const router = useRouter()
  const {chainId,account} = useActiveWeb3React()

  const [projectAddress, setProjectAddress] = useState('');
  const [communityAddress, setCommunityAddress] = useState('');
  useEffect(() => {
    const urlPath = window.location.pathname;
    const params = urlPath.split('/').filter(Boolean); // 使用斜杠进行分割，并过滤掉空字符串

    if (params.length === 4) {

      const lastTwoParams = params.slice(-2); // 获取最后两个参数
      const [project, leader] = lastTwoParams;

      // 在这里处理获取到的参数
      setProjectAddress(project)
      setCommunityAddress(leader)
    }
  }, []);
  
  const handleProjectAddressChange = (event) => {
    setProjectAddress(event.target.value);
  };

  const isDisabled = !projectAddress || !communityAddress;

  const handleCommunityAddressChange = (event) => {
    setCommunityAddress(event.target.value);
  };

  const getNFTId = async () =>{
    try {
      const body = JSON.stringify({
        miner: communityAddress,
        project: projectAddress,
        net: `evm--97`,
      });
      console.info(body)

      const response = await fetch('https://www.equityswap.club/app/user/claim_nft', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });
      const data = await response.json();
      return data.data.id
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  const handleTransfer = async () => {
    const nftId = await getNFTId()
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const accountAddress = accounts[0];
    console.log(chainId,account,accountAddress)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x522338F22de2687c2f488627E0Bd750d40090254", HandNftAbi, signer);
    console.log(nftId)
    const tx = await contract.claim(nftId);
    const receipt1 = await tx.wait();
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
export default CircleClaim;