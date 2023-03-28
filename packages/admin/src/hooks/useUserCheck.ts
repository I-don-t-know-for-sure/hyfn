import { Auth } from "aws-amplify";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUser } from "../contexts/userContext/User";

export const useUserCheck = () => {
  const { userDocument: user, isLoading, loggedIn } = useUser();

  // const { data, isLoading, isFetched } = useGetUserInfo()
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user);
  const userHasDocument =
    typeof user === "object" ? Object.keys(user || {}).length > 0 : false;

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    if (!isLoading) {
      // if (!data) {
      //   navigate('/signup', { replace: true })
      // }
      if (userHasDocument) {
        return;
      }

      if (!userHasDocument) {
        navigate("/createAdmin", { replace: true });
        return;
      }
    }
  }, [isLoading, location.pathname, user]);
};
