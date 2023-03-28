import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useUser } from "contexts/userContext/User";
import { t } from 'utils/i18nextFix';
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
      showNotification({
        title: t("Error"),
        message: t("An Error occurred"),
        id,
        autoClose: true,
        color: "red",
      });
    }
  });
};
