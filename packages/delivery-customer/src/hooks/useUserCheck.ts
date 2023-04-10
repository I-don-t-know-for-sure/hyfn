import { useUser } from "../contexts/userContext/User";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export const useUserCheck = () => {
  const { userDocument: user, isLoading, loggedIn, userId } = useUser();
  console.log("🚀 ~ file: useUserCheck.ts:8 ~ useUserCheck ~ userId", userId);

  // const { data, isLoading, isFetched } = useGetUserInfo()
  const navigate = useNavigate();
  const location = useLocation();
  const [skipOnce, setSkipOnce] = useState(true);

  console.log(user);
  const userHasDocument =
    typeof user === "object" ? Object.keys(user || {}).length > 0 : false;

  useEffect(() => {
    // if (!skipOnce) {
    if (!isLoading) {
      console.log(
        "🚀 ~ file: useUserCheck.ts:17 ~ useEffect ~ loggedIn",
        loggedIn
      );
      if (!loggedIn) {
        if (
          location.pathname === "/signup" ||
          location.pathname === "/login" ||
          location.pathname === "/"
        ) {
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
          navigate("/createcustomer", { replace: true });
          return;
        }
      }
    }
    // }
    setSkipOnce(false);
  }, [isLoading, location.pathname, user]);
};
