import { useRouter } from "next/router";
import CircleShare from "../share1";

const SharePage = () => {
  const router = useRouter()
  return <CircleShare projectAddress={String(router.query.address)} />
}

export default SharePage