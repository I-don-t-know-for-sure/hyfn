import { randomId } from "@mantine/hooks";

import { orderHistory } from "hyfn-types";
import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import { fetchApi } from "utils/fetch";

export const useGetOrderHistory = () => {
  const { userId, userDocument } = useUser();

  return useInfiniteQuery([orderHistory], async () => {
    return await fetchApi({
      arg: [{ ...(userDocument?.storeDoc as any), status: "confirmed" }],
      url: `getOrderHistory`,
    });
  });
};
