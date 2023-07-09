import { useRouter } from "next/router";
import ShareLink from "../../share-link";

const SharePage = () => {
  const router = useRouter();
  const { project, address} = router.query;
  return (
    <ShareLink
      projectAddress={String(project)}
      leaderAddress={String(address)}
    />
  );
};

export default SharePage;