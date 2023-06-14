import { useQuery } from "react-query";
import { fetchApi } from "util/fetch";

export const useGetDriverManagements = (data: {
  country: string;
  toCity: string;
  fromCity: string;
  storeId: string;
}) => {
  return useQuery([], async ({ pageParam }) => {
    return await fetchApi({ url: "getDriverManagements", arg: [data] });
  });
};
