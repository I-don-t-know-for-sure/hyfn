import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { t } from 'utils/i18nextFix';
import { useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetBrand = ({ brandId }: { brandId: string }) => {
  const id = randomId();
  return useQuery(
    ["brand", brandId],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [brandId],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getBrand`,
        });

        return result;
      } catch (error) {
        showNotification({
          title: t("Error"),
          message: t("An Error occurred"),
          id,
          autoClose: true,
          color: "red",
        });
      }
    },
    {
      enabled: !!brandId,
    }
  );
};
