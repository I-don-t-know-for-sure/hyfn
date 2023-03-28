import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useUser } from "contexts/userContext/User";
import { t } from 'utils/i18nextFix';
import { useInfiniteQuery, useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useGetBrands = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useInfiniteQuery(
    ["brands"],
    async ({ queryKey, pageParam }) => {
      try {
        const result = await fetchUtil({
          reqData: [{ creatorId: userDocument._id, lastBrandId: pageParam }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getBrands`,
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
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      // enabled: !filterText,
    }
  );
};
