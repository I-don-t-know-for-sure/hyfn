import { showNotification } from "@mantine/notifications";
import { Auth } from "aws-amplify";
import { useUser } from "contexts/userContext/User";
import { t } from 'utils/i18nextFix';
import { NavigateFunction } from "react-router";
import { User } from "realm-web";

const fetchUtil = async ({
  method = "POST",
  reqData,
  url,

  navigate,
}: {
  method?: string;
  reqData: any;
  url: string;
  user?: User;
  navigate?: NavigateFunction;
}) => {
  // console.log(JSON.stringify(reqData));

  // const { getAccessToken } = await Auth.currentSession()

  // const accessToken =  getAccessToken();
  const {
    signInUserSession: {
      accessToken: { jwtToken },
    },
    username,
    
  } = await Auth.currentAuthenticatedUser();
  console.log("🚀 ~ file: fetch.ts:31 ~ username", username);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ...reqData,
        { userId: username, accessToken: jwtToken },
      ]),
    }).then(async (data) => {
      if (!data.ok || data.status !== 200) {
        console.log(data.status);

        throw new Error("error");
      }
      const result = await data.json();

      return result;
    });
    return response;
  } catch (error) {
    showNotification({
      title: t("Error"),
      message: t("An Error occurred"),
      color: "red",
      autoClose: true,
    });
  }
};

export default fetchUtil;