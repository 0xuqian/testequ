import { useRouter } from 'next/router';
import CircleList from '../../claim'; 

const CircleClaimPage = () => {
  const router = useRouter();
  const { project, leader } = router.query;

  // 在这里使用获取到的参数进行处理

  return (
    <CircleList projectAddr ={String(project)} leaderAddress={String(leader)} />
  );
};

export default CircleClaimPage;