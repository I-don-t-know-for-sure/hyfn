import { randomId } from "@mantine/hooks";

import { log } from "console";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import { fetchApi } from "utils/fetch";
import { CollectionInfo } from "../types";
export const useGetCollection = (collectionId: string) => {
  const { userId, userDocument } = useUser();

  return useQuery(["collection", collectionId], async () => {
    try {
      const data = await fetchApi({
        arg: [userDocument.storeDoc, collectionId],
        url: `getCollection`,
      });

      //body: JSON.stringify([user?.customData.storeDoc, collectionId]),
      //const result = await data.json();

      return data;
    } catch (e) {
      console.error(e);
    }
  });
};
