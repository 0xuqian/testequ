import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { create } from 'ipfs-http-client';
import { Button } from '@pancakeswap/uikit'
import useToast from "hooks/useToast";
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from "@pancakeswap/localization";
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
  flex-direction: column;
  flex-wrap: no-wrap;
  justify-content: space-between;
  align-items: center;
  // border-radius: 8px;
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

const SelectButton = styled(Button)`
  margin: 40px 8px;
  width: 100%;
  max-width: 350px;
`

const ProfilePage = () => {

  const { account, library, active } = useWeb3React()
  const { t } = useTranslation()

  const { toastError, toastSuccess } = useToast()
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isInfoMotify, setInfoMotify] = useState<boolean>(true)
  const [reloadUserInfo, setReloadUserInfo] = useState<boolean>(false);
  const userInfo = useRankingInfo(account, reloadUserInfo)

  const projectId = '2RxSDjGGChYbDccqxgSHDCGWDGT';
  const projectSecret = '9a0a07cc2c7e8b6a9115b8a8b451391c';
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${btoa(`${projectId}:${projectSecret}`)}`
    }
  });

  useEffect(() => {
    setReloadUserInfo(false)
    setInfoMotify(false)
    setSelectedImage(null)
    if (userInfo) {
      setImagePreview(userInfo?.icon)
      setNickname(userInfo?.name)
    }
  }, [userInfo])

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    selectedImage || (nickname !== userInfo?.name) && nickname ? setInfoMotify(true) : setInfoMotify(false);
  }, [nickname, userInfo?.name, selectedImage])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const verifySignature = async (): Promise<string> => {

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const address = await signer.getAddress()
    try {
      await library.provider.request({ method: "eth_requestAccounts" });

      const signer = library.getSigner();
      const address = await signer.getAddress()
      setInfoMotify(false)
      const message = `Request to change personal information:
    address: ${address}
      `;
      const signature = await signer.signMessage(message)
      return signature
    } catch {
      setInfoMotify(true)
      return null
    }
  }

  const handleSubmit = async () => {
    const signature = await verifySignature()
    let url;
    if (selectedImage) {
      try {
        const added = await ipfs.add(selectedImage);
        url = `https://ipfs.io/ipfs/${added.path}`;
      } catch (err) {
        console.error(err);
      }
    } else {
      url = imagePreview;
    }
    try {
      const body = JSON.stringify({
        new_icon: url,
        new_name: nickname,
        wallet: account,
        sign: signature,
        new_tg: null,
        new_twitter: null,
      });
      const response = await fetch('https://www.equityswap.club/app/user/setuserinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        toastError(`${t('Profile update failed')}`)
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const uploadStatus = await response.json();
      if (uploadStatus.code === 0) {
        setReloadUserInfo(!reloadUserInfo);
        toastSuccess(
          `${t('Profile updated successfully')}!`,
        )
      }
    } catch {
      console.info("upload to ipfs failed")
      setInfoMotify(true)
    }
  };

  return (
    <Page>
      <ListWrapper>
        <List>
          <ListItem onClick={() => document.getElementById('fileInput')?.click()}>
            <TitleName>头像dcv </TitleName>
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
                <input type='text' value={nickname} onChange={(event) => setNickname(event.target.value)} onBlur={() => setIsEditing(false)} />
              ) : (
                <div onClick={() => setIsEditing(true)} onKeyPress={() => setIsEditing(true)} tabIndex={0} role="button">{nickname}</div>
              )}
              <Arrow width={16} height={16} src="/images/circle/arrow.png" alt="to link" />
            </NickNameDiv>
          </ListItem>
          <ListItem>
            <TitleName>Twitter
            </TitleName>
            <NickNameDiv>
              <div>点击认证</div>
              <Arrow width={16} height={16} src="/images/circle/arrow.png" alt="to link" />
            </NickNameDiv>
          </ListItem>
          <SelectButton disabled={!isInfoMotify} onClick={active ? handleSubmit : undefined} style={{ marginTop: '15px' }}>{t('save')}</SelectButton>
        </List>
      </ListWrapper>
    </Page>
  )
}
export default ProfilePage


