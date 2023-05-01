import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { collection } from "hyfn-types";
import { log } from "console";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";
import { CollectionInfo } from "../types";
export const useGetCollection = (collectionId: string) => {
  const { userId, userDocument } = useUser();

  return useQuery([collection, collectionId], async () => {
    try {
      const data = await fetchUtil({
        reqData: [userDocument.storeDoc, collectionId],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getCollection`,
      });

      //body: JSON.stringify([user?.customData.storeDoc, collectionId]),
      //const result = await data.json();

      return data;
    } catch (e) {
      console.error(e);
    }
  });
};
