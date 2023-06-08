import { useQuery } from "react-query";

import { fetchApi } from "utils/fetch";

export const useSearchDriverByID = ({
  isEnabled,
  searchValue,
}: {
  isEnabled: boolean;
  searchValue: string;
}) => {
  return useQuery(
    ["search", searchValue],
    async () => {
      return await fetchApi({
        arg: [{ driverId: searchValue, management: "stores" }],
        url: `searchDriverById`,
      });
    },
    {
      enabled: isEnabled,
    }
  );
};
