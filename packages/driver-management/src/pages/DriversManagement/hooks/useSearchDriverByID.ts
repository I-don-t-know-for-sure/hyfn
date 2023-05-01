import { search } from "hyfn-types";
import { useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useSearchDriverByID = ({
  isEnabled,
  searchValue,
}: {
  isEnabled: boolean;
  searchValue: string;
}) => {
  return useQuery(
    [search, searchValue],
    async () => {
      return await fetchUtil({
        reqData: [{ driverId: searchValue }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/searchDriverById`,
      });
    },
    {
      enabled: isEnabled,
    }
  );
};
