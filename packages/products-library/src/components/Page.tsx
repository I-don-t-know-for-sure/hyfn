import { Loader } from "@mantine/core";
import { useUser } from "contexts/userContext/User";
import { Navigate, useLocation } from "react-router";

function Page({ children }: { children: JSX.Element }) {
  const { loggedIn, isLoading } = useUser();
  const location = useLocation();

  return isLoading ? <Loader /> : children;
}

export default Page;
