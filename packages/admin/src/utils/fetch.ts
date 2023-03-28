import { showNotification } from "@mantine/notifications";
import { t } from 'utils/i18nextFix';
import { NavigateFunction } from "react-router";

import { getAccessToken } from "./getAccessToken";

const fetchUtil = async ({
  method = "POST",
  reqData,
  url,

  navigate,
}: {
  method?: string;
  reqData: any;
  url: string;

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
