import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";

import useUploadImage from "hooks/useUploadImage";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useGetDriverDocument = () => {
  const { userDocument, refetch, isLoading } = useUser();
  refetch();
  return useQuery(
    ["driverDoc", userDocument.id],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ driverId: userDocument.id }],
          url: `getDriverDocument`,
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
