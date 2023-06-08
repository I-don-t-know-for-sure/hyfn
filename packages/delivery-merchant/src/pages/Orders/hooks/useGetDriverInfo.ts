import { useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetDriverInfo = ({
  driverId,
  opened,
}: {
  driverId: string;
  opened: boolean;
}) => {
  return useQuery(
    ["GET_DRIVER_INFO"],
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
