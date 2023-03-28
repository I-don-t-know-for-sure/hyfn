import { createContext } from "react";
// import { UserContextApi } from "./types";
// import usePersistState from "../../hooks/usePersistState";
// userInfo : {}
// updaters: () => {}

export const UserContext = createContext(undefined);

const UserProvider: React.FC = ({ children }) => {
  // make this type safe
  // const updateUserInfo = useCallback(
  //   (newInfo: any) => {

  //     setUserInfo((prev) => {
  //       return { ...prev, ...newInfo };
  //     });
  //   },
  //   [setUserInfo]
  // );

  return (
    <UserContext.Provider value={{ hello: "hi" }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
