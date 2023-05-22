import { Auth } from "aws-amplify";
import { useUser } from "contexts/userContext/User";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const useUserCheck = () => {
  const { userDocument: user, isLoading, loggedIn } = useUser();

  // const { data, isLoading, isFetched } = useGetUserInfo()
  const navigate = useNavigate();
  const location = useLocation();
  const [skipOnce, setSkipOnce] = useState(true);

  const userHasDocument =
    typeof user === "object" ? Object.keys(user).length > 0 : false;

  useEffect(() => {
    // if (!skipOnce) {
    if (!isLoading) {
      if (!loggedIn) {
        if (location.pathname === "/signup" || location.pathname === "/login") {
          return;
        }
        navigate("/signup", { replace: true });

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
          navigate("/createcompany", { replace: true });
          return;
        }
      }
    }
    // }
    setSkipOnce(false);
  }, [isLoading, location.pathname, user]);
};
