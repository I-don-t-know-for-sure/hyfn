import { getAccessToken } from "./getAccessToken";
import { showNotification, updateNotification } from "@mantine/notifications";
import { randomId } from "@mantine/hooks";
import {
  errorNotification,
  loadingNotification,
  successNotification,
} from "hyfn-client";
const fetchUtil = async ({
  method = "POST",
  reqData,
  url,
  notifi = true,
}: {
  method?: string;
  reqData: any;
  url: string;
  notifi?: boolean;
}) => {
  console.log("🚀 ~ file: fetch.ts:21 ~ url:", url);
  const notGet = !url.includes("get");
  console.log("🚀 ~ file: fetch.ts:22 ~ notGet:", notGet);
  const accessTokenObject = await getAccessToken();
  const id = randomId();

  notifi &&
    notGet &&
    showNotification({
      ...loadingNotification,
      id,
    });
  const data = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify([...reqData, accessTokenObject]),
  });
  if (data.status !== 200) {
    notifi &&
      notGet &&
      updateNotification({
        ...errorNotification,
        id,
      });
    throw new Error(data.statusText);
  }
  notifi &&
    notGet &&
    updateNotification({
      ...successNotification,
      id,
    });
  const result = await data.json();
  return result;
};

export default fetchUtil;

/* import { showNotification } from "@mantine/notifications";
import { t } from "utils/i18nextFix";
import { NavigateFunction } from "react-router";
import { User } from "realm-web";
import { getAccessToken } from "./getAccessToken";

const fetchUtil = async ({
  method = "POST",
  reqData,
  url,
  user,
  navigate,
}: {
  method?: string;
  reqData: any;
  url: string;
  user?: User;
  navigate?: NavigateFunction;
}) => {
  console.log("🚀 ~ file: fetch.ts:20 ~ reqData", reqData);
  try {
    // console.log(JSON.stringify(reqData));
    const accessTokenObject = await getAccessToken();

    const response = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify([...reqData, accessTokenObject]),
    }).then(async (data) => {
      if (!data.ok || data.status !== 200) {
        console.log(data.status);

        throw new Error("error");
      }
      const result = await data.json();
      console.log(result);

      return result;
    });
    return response;
  } catch (error) {
    console.error(error);

    showNotification({
      title: t("Error"),
      message: t("infetch"),
      // color: 'red',
      autoClose: true,
    });
    const { message } = error as any;
    throw new Error(message);
  }
};

export default fetchUtil;
 */
