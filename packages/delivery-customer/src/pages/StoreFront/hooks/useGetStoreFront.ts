import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { STOREFRONT } from "hyfn-types";
import { useCustomerData } from "contexts/customerData/CustomerDataProvider";
import { t } from "util/i18nextFix";

import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

import fetchUtil from "util/fetch";

export const useGetStoreFront = ({
  storefront,
  country,
  city,
}: {
  storefront: string;
  country: string;
  city: string;
}) => {
  const { customerData } = useCustomerData();
  return useQuery([STOREFRONT, storefront], async () => {
    try {
      const result = await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/getStoreFront`,
        reqData: [{ city, country }, storefront],
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
