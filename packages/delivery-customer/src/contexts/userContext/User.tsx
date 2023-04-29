import { useLocalStorage } from "@mantine/hooks";

import { Auth } from "aws-amplify";
import { LOGGED_IN, USER_DOCUMENT, USER_ID } from "config/constents";

import { useGetUserDocument } from "hooks/useGetUserDocument";
import { useGetUserId } from "hooks/useGetUserId";

import { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "react-query";

export const UserContext = createContext(undefined);

interface UserControl {
  userDocument: any;
  setUserDocument: any;
  refetch: any;
  isLoading: boolean;
  signIn: any;
  signOut: any;
  signUp: any;
  sendPasswordChangeConfirmationCode: any;
  changePasswordAndConfirmCode: any;
  confirmSignUp: any;
  userId: string;
  loggedIn: boolean;
  resendConfirmationEmail: any;
}

const UserProvider: React.FC = ({ children }) => {
  const [userDocument, setUserDocument] = useLocalStorage({
    key: USER_DOCUMENT,
  });
  const [userId, setUserId] = useLocalStorage({
    key: USER_ID,
    defaultValue: "",
  });
  const [loggedIn, setLoggedIn] = useLocalStorage({
    key: LOGGED_IN,
    defaultValue: false,
  });

  useGetUserId({ loggedIn, setUserId });

  const { data, isLoading, isFetched, refetch } = useGetUserDocument({
    userId,
  });
  const queryClient = useQueryClient();
  useEffect(() => {
    console.log("🚀 ~ file: User.tsx:11 ~ data", data);

    if (isFetched && !isLoading) {
      if (typeof data === "object" && data !== null && data !== undefined) {
        if (Object.keys(data).length === 0) {
          setUserDocument(undefined);
          return;
        }
      }
      setUserDocument({ ...data });
    }
  }, [isLoading, isFetched, data]);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    // try {
    // the actual required field is username but we gave username and email have the same value
    const user = await Auth.signIn(email, password);
    console.log("🚀 ~ file: User.tsx:50 ~ signIn ~ user", user);
    setUserId(user.username);
    setLoggedIn(true);
    await queryClient.resetQueries();
    refetch();
    // } catch (error) {
    //   console.log('error signing in', error);
    // }
  };

  const signUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    // try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email, // optional
        // phone_number,   // optional - E.164 number convention
        // other custom attributes
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    console.log("🚀 ~ file: User.tsx:75 ~ signUp ~ user", user);
    // setUserId(user)
    // } catch (error) {
    //   console.log('error signing up:', error);
    // }
  };

  const resendConfirmationEmail = async ({
    username,
  }: {
    username: string;
  }) => {
    // try {
    await Auth.resendSignUp(username);
    console.log("code resent successfully");
    // } catch (err) {
    //   console.log('error resending code: ', err);
    // }
  };

  const confirmSignUp = async ({
    email,
    code,
    navigate,
  }: {
    email: string;
    code: string;
    navigate: any;
  }) => {
    // try {
    await Auth.confirmSignUp(email, code);
    // const user = await Auth.currentAuthenticatedUser()
    await queryClient.resetQueries();

    // setUserId(user.username)
    refetch();
    setLoggedIn(true);
    navigate("/", { replace: true });

    // } catch (error) {
    //   console.log('error confirming sign up', error);
    // }
  };

  const signOut = async () => {
    // try {
    setLoggedIn(false);
    setUserId("");
    await Auth.signOut();
    await queryClient.resetQueries();
    refetch();
    // } catch (error) {
    //   console.log('error signing out: ', error);
    // }
  };

  const resetPassword = () => {
    console.log();
  };

  const sendPasswordChangeConfirmationCode = async ({
    email,
  }: {
    email: string;
  }) => {
    // try {
    const data = await Auth.forgotPassword(email);
    console.log(data);
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const changePasswordAndConfirmCode = async ({
    code,
    email,
    newPassword,
  }: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    try {
      Auth.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userDocument,
        setUserDocument,
        refetch,
        isLoading,
        signIn,
        signOut,
        signUp,
        sendPasswordChangeConfirmationCode,
        changePasswordAndConfirmCode,
        confirmSignUp,
        loggedIn: !!userId,
        userId,
        resendConfirmationEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user: UserControl = useContext(UserContext);
  if (!user) {
    throw new Error("call inside the component tree");
  }

  return user;
};

export default UserProvider;
