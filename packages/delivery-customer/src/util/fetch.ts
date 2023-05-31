import { getAccessToken } from "./getAccessToken";
import { showNotification, updateNotification } from "@mantine/notifications";
import { randomId } from "@mantine/hooks";
import {
  errorNotification,
  loadingNotification,
  successNotification,
} from "hyfn-client";
import { LambdaHandlers, TransactionsHandler } from "customer-backend";
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

type Handlers = LambdaHandlers & TransactionsHandler;

type Function<T extends keyof Handlers> = (
  arg: Handlers[T]["arg"]
) => Handlers[T]["return"];
export const fetchApi = async <T extends keyof Handlers>({
  arg: reqData,
  url,
  method = "POST",
  notifi = true,
}: {
  url: T;
  arg: Parameters<Function<T>>["0"];
  method?: "POST" | "GET" | "PUT";
  notifi?: boolean;
}): Promise<ReturnType<Function<T>>> => {
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

// This will not throw a compilation error because the type of `arg` matches
// the type required by the `url` property.
