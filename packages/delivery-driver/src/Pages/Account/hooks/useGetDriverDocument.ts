import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
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
    [driverDoc, userDocument._id],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverId: userDocument._id }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getDriverDocument`,
        });
        return result;
      } catch (error) {
        showNotification({
          title: t("Error"),
          message: t("An Error occurred"),

          loading: false,
          autoClose: true,
          color: "red",
        });
      }
    },
    {
      enabled: !isLoading,
    }
  );
};
