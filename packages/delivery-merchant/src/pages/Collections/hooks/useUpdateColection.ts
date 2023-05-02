import { randomId } from "@mantine/hooks";

import { log } from "console";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";
import { CollectionInfo } from "../types";

export const useUpdateCollection = () => {
  const { userId, userDocument } = useUser();

  const id = randomId();
  return useMutation(
    "collection",
    async ({
      collection,
      collectionId,
    }: {
      collectionId: string;
      collection: CollectionInfo;
    }) => {
      try {
        const result = await fetchUtil({
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateCollection`,
          reqData: [collection, userDocument?.storeDoc, collectionId],
        });
        return result;
      } catch (e) {
        console.error(e);
      }
    }
  );
};
