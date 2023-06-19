import { useCustomerData } from "contexts/customerData/CustomerDataProvider";

import { useQuery } from "react-query";

import { fetchApi } from "util/fetch";

export const useGetStoreFront = ({
  storefront
}: // country,
// city,
{
  storefront: string;
  // country: string;
  // city: string;
}) => {
  const { customerData } = useCustomerData();
  return useQuery(["STOREFRONT", storefront], async () => {
    try {
      const result = await fetchApi({
        url: `getStoreFront`,
        arg: [{}, storefront]
      });

      return result;
    } catch (e) {
      console.error(e);
    }
  });
};
