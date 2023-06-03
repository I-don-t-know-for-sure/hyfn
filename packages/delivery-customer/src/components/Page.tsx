import { Loader } from "hyfn-client";
import { useUser } from "../contexts/userContext/User";

function Page({ children }: { children: JSX.Element }) {
  const { loggedIn, isLoading } = useUser();

  return isLoading ? <Loader /> : children;
}

export default Page;
