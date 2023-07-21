import styled from "styled-components";
import { Image } from "@pancakeswap/uikit";
import { NftHistory } from "../../../hooks/useHistoryNftInfo";


const List = styled.div`
  width: 100%;
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px 0 8px;
  border-radius: 8px;
`

const ListLeft = styled.div`
  display: flex;
  align-items: center;
`

const ListInfo = styled.div``

const ListRight = styled.div``

const Icon = styled(Image)`
  margin-right: 10px;
  width: 32px;
  height: 32px;
`

const ListTitle = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  color: #15141f;
`

const ListDesc = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #a2a0a8;
`

const ListValue = styled.div`
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: right;
  color: #11142d;
`

const ProjectInfo = ( {projectInfo}:{projectInfo: NftHistory}) => {
  return (
    <List>
    <ListLeft>
      <Icon width={32} height={32} src={projectInfo.pro_icon} alt="link" />
      <ListInfo>
        <ListTitle>{projectInfo.pro_name}</ListTitle>
        <ListDesc>{projectInfo.pro_name}</ListDesc>
      </ListInfo>
    </ListLeft>
    <ListRight>
      <ListValue>{projectInfo.claim_number.toString()} / {projectInfo.mint_number.toString()}</ListValue>
    </ListRight>
  </List>
  );
};

export default ProjectInfo;