import { useRouter } from 'next/router';
import CircleClaim from '../../claim'; 

const CircleClaimPage = () => {
  const router = useRouter();
  const { project, leaderAddress } = router.query;

  return (
    <CircleClaim projectAddr ={String(project)} leaderAddress={String(leaderAddress)} />
  );
};

export default CircleClaimPage;