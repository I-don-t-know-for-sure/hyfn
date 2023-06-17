import { getAccessToken } from "./getAccessToken";
import { showNotification, updateNotification } from "@mantine/notifications";
import { randomId } from "@mantine/hooks";
import {
  errorNotification,
  loadingNotification,
  successNotification
} from "hyfn-client";
import { LocalCard, GetOrder, LambdaHandlers } from "store-backend";
import { TransactionsHandler } from "customer-backend";

import { t } from "utils/i18nextFix";
type Handlers = LambdaHandlers & LocalCard & GetOrder & TransactionsHandler;
type Function<T extends keyof Handlers> = (
  arg: Handlers[T]["arg"]
) => Handlers[T]["return"];
export const fetchApi = async <T extends keyof Handlers>({
  arg: reqData,
  url,
  method = "POST",
  notifi = true
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
      id
    });
  const data = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/${url}`, {
    method,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify([...reqData, accessTokenObject])
  });
  if (data.status !== 200) {
    const message = await data.json();
    notifi &&
      notGet &&
      updateNotification({
        ...errorNotification,
        message: t(message),
        id
      });
    throw new Error(data.statusText);
  }
  notifi &&
    notGet &&
    updateNotification({
      ...successNotification,
      id
    });
  const result = await data.json();
  return result;
};
