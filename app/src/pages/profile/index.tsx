import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import Page from 'views/Page';
import useRankingInfo from '../../hooks/useRankingDetails'


const ListWrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 550px;
  background: #ffff;
  padding: 0 20px 0 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
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
  &:hover {
    background: #e8e8e8;  
  }
`

const SaveButtion = styled.button`
  width : 80%;
  cursor: pointer;
  height : 50px;
  line-height: 40px;
  border-radius: 10px;
`
const Avatar1 = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0px;
  @media screen and (max-width: 852px) {
    margin: 0 9px;
  }
`
const TitleName = styled.div`
  width: 50px;
  height: 50px;
  line-height: 50px;
`

const ListItem = styled.div`
  width: 100%;
  height: 56px;
  cursor: pointer;
  border-bottom: 1px solid rgba(232, 232, 232, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  @media screen and (max-width: 852px) {
    height: 80px;
  }
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const NickNameDiv = styled.div`
  display: flex;
  flex-direction: no-wrap;
`

const Arrow = styled.img`
  width: 16px;
  height: 16px;
`
const AvatarImageDiv = styled.div`
  height: 56px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  
`

const ProfilePage = () => {

  const { account } = useWeb3React()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('Your Nickname');
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);

  const userInfo = useRankingInfo(account)
  const projectId = '2RxSDjGGChYbDccqxgSHDCGWDGT';
  const projectSecret = '9a0a07cc2c7e8b6a9115b8a8b451391c';
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${  btoa(`${projectId}:${projectSecret}`)}`
    }
  });

  useEffect(() => {
    setUserInfoLoaded(false)
  }, [account]);

  useEffect(() => {
    if (userInfo && userInfo.user_wallet?.toLowerCase() === account?.toLowerCase() && !userInfoLoaded) {

      setImagePreview(userInfo.icon);
      setNickname(userInfo.name);
      setUserInfoLoaded(true);
    }
  }, [userInfo, userInfoLoaded,account]);
  
  useEffect(() => {
    if (userInfo?.icon !== imagePreview && userInfo?.name !== nickname && userInfoLoaded){
      setImagePreview(imagePreview);
      setNickname(nickname);
    }
  }, [account, nickname, imagePreview, userInfo]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNicknameBlur = () => {
    setIsEditing(false);
  };

  const handleNicknameClick = () => {
    setIsEditing(true);
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const verifySignature= async (): Promise<string>  => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log('Connected wallet address:', address);
    console.log('Connected network:', network);

    const message = `Request to change personal information:
  address: ${address}
    `;

    const signature = await signer.signMessage(message)
    console.log(signature)
    return signature
  }

  const handleSubmit = async () => {
    const signature = await verifySignature()
    let url;
    try {
      const added = await ipfs.add(imagePreview);
      url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url)
    } catch (err) {
      console.error(err);
    }

    if (imagePreview && nickname) {
      console.log(url)
      try {
          const body = JSON.stringify({
            new_icon: url,
            new_name: nickname,
            wallet: account,
            sign: signature,
            new_tg: null,
            new_twitter: null,
          });
          console.log(url,nickname)
          const response = await fetch('https://www.equityswap.club/app/user/setuserinfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log(body)
          const data = await response.json();
          console.log(data);
        }catch{
          console.log("上传ipfs失败")
        }
    }
  };


  return(
    <Page>
    <ListWrapper>
      <List>
      <ListItem onClick={() => document.getElementById('fileInput')?.click()}>
          <TitleName>头像</TitleName>
          <AvatarImageDiv>
            <Avatar1 src={imagePreview} />
            <Arrow width={16} height={16} src="/images/circle/arrow.png" alt="to link" />
          </AvatarImageDiv>
      </ListItem>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
        <ListItem>
          <TitleName>昵称</TitleName>
          <NickNameDiv>
            {isEditing ? (
              <input type='text' value={nickname} onChange={handleNicknameChange} onBlur={handleNicknameBlur}  />
            ) : (
              <div onClick={handleNicknameClick} onKeyPress={handleNicknameClick} tabIndex={0} role="button">{nickname}</div>
            )}
            <Arrow width={16} height={16} src="/images/circle/arrow.png" alt="to link" />
          </NickNameDiv>
        </ListItem>
        <ListItem>
          <TitleName>Twitter
          </TitleName>
          <NickNameDiv>          
            <div>点击认证</div>
            <Arrow width={16} height={16}  src="/images/circle/arrow.png" alt="to link" />
          </NickNameDiv>
        </ListItem>   
        <SaveButtion onClick={handleSubmit} style={{marginTop: '15px'}}>SAVE</SaveButtion>
      </List>
    </ListWrapper>
    </Page>
  )
}
export default ProfilePage


