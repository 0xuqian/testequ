import React, { useState } from 'react';
import styled from 'styled-components'


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
  text
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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('Nickname');

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

  const handleSubmit = async () => {
    if (selectedImage && nickname) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage); // 'selectedImage' 是 File 对象
        reader.onloadend = async () => {
          const base64Image = reader.result;
          console.log(base64Image)
          const body = JSON.stringify({
            new_icon: base64Image,
            new_name: nickname,
            wallet: "0xe18778455dd4Ff13f319F9f72defE070ee696969",
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
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log(data);
        };
        reader.onerror = () => {
          console.error("Failed to read image file:", reader.error);
        };
      } catch (error) {
        console.error('Failed to upload data:', error);
      }
    }
  };


  return(
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
  )
}
export default ProfilePage


