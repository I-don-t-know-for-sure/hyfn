import { GET_DRIVER_INFO } from "hyfn-types";
import { useQuery } from "react-query";
import { fetchApi } from "util/fetch";

export const useGetDriverInfo = ({
  driverId,
  opened,
}: {
  driverId: string;
  opened: boolean;
}) => {
  return useQuery(
    [GET_DRIVER_INFO],
    async () => {
      const result = await fetchApi({
        arg: [{ driverId }],
        url: `getDriverInfo`,
      });
      return result;
    },
    {
      enabled: !!(driverId && opened),
    }
  );
};
