import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetBrandsForList = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useQuery(["brands"], async () => {
    try {
      const result = await fetchUtil({
        reqData: [{ creatorId: userDocument._id }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getBrandsForList`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useGetBrandsForList.ts:22 ~ returnuseQuery ~ error:",
        error
      );
    }
  });
};
