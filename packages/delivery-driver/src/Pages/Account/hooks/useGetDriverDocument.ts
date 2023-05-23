import { randomId } from "@mantine/hooks";

import { driverDoc } from "hyfn-types";
import { useUser } from "contexts/userContext/User";

import useUploadImage from "hooks/useUploadImage";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetDriverDocument = () => {
  const { userDocument, refetch, isLoading } = useUser();
  refetch();
  return useQuery(
    [driverDoc, userDocument.id],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverId: userDocument.id }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getDriverDocument`,
        });
        return result;
      } catch (error) {
        console.log("🚀 ~ file: useGetDriverDocument.ts:25 ~ error:", error);
      }
    },
    {
      enabled: !isLoading,
    }
  );
};
