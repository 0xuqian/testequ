import { useRouter } from "next/router";
import ShareLink from "../../claimed";

const SharePage = () => {
  const router = useRouter();
  const { project } = router.query;
  return (
    <ShareLink
      projectAddress={String(project)}
    />
  );
};

export default SharePage;