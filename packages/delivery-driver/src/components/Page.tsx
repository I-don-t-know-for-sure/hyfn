import { Loader } from "hyfn-client";
import { useUser } from "contexts/userContext/User";
import { useGetCurrentSession } from "hooks/useGetCurrentSession";
import { Navigate, useLocation } from "react-router";

function Page({ children }: { children: JSX.Element }) {
  const { loggedIn, isLoading } = useUser();
  let location = useLocation();

  return isLoading ? <Loader /> : children;
}

export default Page;
