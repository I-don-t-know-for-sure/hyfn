import { useContext } from "react";
import { UserContext } from "../contexts/userContext/User";
import { UserContextApi } from "../contexts/UserContextOld/types";

const useUserInfo = (): UserContextApi => {
  const context = useContext(UserContext);
  return context;
};

export default useUserInfo;
