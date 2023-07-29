import styled from "styled-components";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useToast from "hooks/useToast";
import { useTranslation } from "@pancakeswap/localization"

interface LinkInfo {
  projectAddr: string;
  leaderAddr: string;
  claimRatio: boolean;
}

interface ShareBtnProps {
  claimRatio: boolean;
}

const ShareBtn = styled.img<ShareBtnProps>` 
  filter: ${props => (props.claimRatio ? 'grayscale(0)' : 'grayscale(1)')};
  margin-left: 12px;
  cursor: ${props => (props.claimRatio ? 'pointer' : '')};
`

export const ShareIcon: React.FC<LinkInfo> = ({ projectAddr, leaderAddr, claimRatio }) => {
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const handleCopy = () => {
    // setCopied(true);
    setTimeout(() => "", 2000);
    toastSuccess(t('Share link has been copied to clipboard'))
  };

  return (
    <>
      {claimRatio ? (
        <CopyToClipboard
          text={`https://www.equityswap.club/circle/claim/${projectAddr}/${leaderAddr}`}
          onCopy={handleCopy}
        >
          <ShareBtn claimRatio={claimRatio} src="/images/sharelink.png" />
        </CopyToClipboard>
      ) : (
        <ShareBtn claimRatio={claimRatio} src="/images/sharelink.png" />
      )}
    </>
  )
}