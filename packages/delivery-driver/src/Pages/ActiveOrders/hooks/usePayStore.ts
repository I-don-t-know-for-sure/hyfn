import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";

import { t } from "utils/i18nextFix";
import { useMutation, useQuery, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const usePayStore = () => {
  const { userDocument: user } = useUser();
  const [{ country }] = useLocation();
  const id = randomId();
  return useMutation(async (storeId: string) => {
    try {
      const result = await fetchUtil({
        reqData: [
          {
            driverId: user?.id,
            storeId,
            country,
          },
        ],
        url: `${import.meta.env.VITE_APP_BASE_URL}/payStore`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: usePayStore.ts:32 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
