import { randomId } from "@mantine/hooks";

import { useCustomerData } from "contexts/customerData/CustomerDataProvider";
import { useUser } from "contexts/userContext/User";
import { t } from "util/i18nextFix";

import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

import fetchUtil from "util/fetch";

export const useRateStore = () => {
  const { userId, userDocument } = useUser();

  const { updateRatings, cancelRating } = useCustomerData();
  const id = randomId();
  return useMutation(
    ["rating"],
    async ({
      storeId,
      country,
      rating,
      city,
    }: {
      storeId: string;
      country: string;
      rating: number;
      city: string;
    }) => {
      try {
        updateRatings(storeId, rating);

        console.log(import.meta.env.VITE_APP_RATESTORE);

        const result = fetchUtil({
          url: import.meta.env.VITE_APP_RATESTORE,
          reqData: [
            {
              customerId: userDocument.customerId,
              storeId,
              country,
              rating,
              city,
            },
          ],
        });

        return result;
      } catch (e) {
        console.error(e);
        cancelRating(storeId);
      }
    }
  );
};
