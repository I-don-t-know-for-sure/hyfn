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
  const accessTokenObject = await getAccessToken();
  const id = randomId();

  notifi &&
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
      updateNotification({
        ...errorNotification,
        id,
      });
    throw new Error(data.statusText);
  }
  notifi &&
    updateNotification({
      ...successNotification,
      id,
    });
  const result = await data.json();
  return result;
};

export default fetchUtil;

/* 
import { getAccessToken } from './getAccessToken'

const fetchUtil = async ({
  method = 'POST',
  reqData,
  url,
}: {
  method?: string
  reqData: any
  url: string
  user?: any
}) => {
  // const { id: userId, accessToken } = user;
  console.log(reqData)
  const accessTokenObject = await getAccessToken()
  return await fetch(url, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    // body: JSON.stringify([...reqData, { userId, accessToken }]),
    body: JSON.stringify([...reqData, accessTokenObject]),
  }).then(async (data) => {
    const result = await data.json()
    console.log(result)
    return result
  })
}

export default fetchUtil
 */
