// import { showNotification } from '@mantine/notifications'
// import { t } from 'i18next'
import { NavigateFunction } from "react-router";

// import { getAccessToken } from './getAccessToken'

export const fetchApi = async ({
  method = "POST",
  reqData,
  url,
  // user,
  navigate,
}: {
  method?: string;
  reqData: any;
  url: string;
  // user?: User
  navigate?: NavigateFunction;
}) => {
  console.log("🚀 ~ file: fetch.ts:20 ~ reqData", reqData);
  try {
    // console.log(JSON.stringify(reqData));
    // const accessTokenObject = await getAccessToken()

    const response = await fetch(
      `${import.meta.env.VITE_APP_BASE_URL}/${url}`,
      {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify([...reqData]),
      }
    ).then(async (data) => {
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

    const { message } = error as any;
    throw new Error(message);
  }
};
