import { useRouter } from "next/router";
import CircleShare from "../../share-link";

const SharePage = () => {
  const router = useRouter();
  const { project, address } = router.query;
  console.log(project,address)
  return (
    <CircleShare
      projectAddress={String(project)} leaderAddress={String(address)}    />
  );
};

export default SharePage;