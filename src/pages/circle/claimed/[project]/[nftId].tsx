import { useRouter } from 'next/router';
import Claimed from '../../claimed'; 

const ClaimedPage = () => {
  const router = useRouter();
  const { project, nftId } = router.query;

  return (
    <Claimed projectAddress={String(project)} nftId = {String(nftId)} />
  );
};

export default ClaimedPage;