import { randomId } from "@mantine/hooks";

import { STOREFRONT } from "hyfn-types";
import { useCustomerData } from "contexts/customerData/CustomerDataProvider";
import { t } from "util/i18nextFix";

import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

import { fetchApi } from "util/fetch";

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
      const result = await fetchApi({
        url: `getStoreFront`,
        arg: [{ city, country }, storefront],
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
