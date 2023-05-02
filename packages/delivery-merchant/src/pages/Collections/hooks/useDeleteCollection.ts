import { randomId } from "@mantine/hooks";

import { log } from "console";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";
import { CollectionInfo } from "../types";

export const useDeleteCollection = () => {
  const { userId, userDocument } = useUser();

  const navigate = useNavigate();
  const id = randomId();
  return useMutation("collections", async (collectionId: string) => {
    try {
      const data = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/deleteCollection`,
        reqData: [userDocument?.storeDoc, collectionId],
      });

      navigate("/collections", { replace: true });
      return data;
    } catch (e) {
      console.error(e);
    }
  });
};
