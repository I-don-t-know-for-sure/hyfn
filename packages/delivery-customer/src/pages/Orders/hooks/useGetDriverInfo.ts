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
    [],
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
