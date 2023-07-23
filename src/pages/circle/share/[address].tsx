import { useRouter } from "next/router";
import CircleShare from "../share";

const SharePage = () => {
  const router = useRouter()
  return <CircleShare projectAddress={String(router.query.address)} />
}

export default SharePage