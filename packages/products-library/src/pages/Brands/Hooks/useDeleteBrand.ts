import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useUser } from "contexts/userContext/User";
import { t } from 'utils/i18nextFix';
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useDeleteBrand = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useMutation(async ({ brandId }: { brandId: string }) => {
    try {
      showNotification({
        title: t("inserting new products"),
        message: t("In progress"),
        id,
        loading: true,
        autoClose: false,
      });
      const result = await fetchUtil({
        reqData: [{ creatorId: userDocument._id, brandId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/deleteBrand`,
      });
      updateNotification({
        title: t("Products were added successfully"),
        message: t("Successful"),
        id,
        loading: false,
        autoClose: true,
      });
      return result;
    } catch (error) {
      updateNotification({
        title: t("Error"),
        message: t("An Error occurred"),
        id,
        autoClose: true,
        color: "red",
      });
    }
  });
};
