import { GET_DRIVER_INFO } from 'config/constents';
import { useQuery } from 'react-query';
import fetchUtil from 'util/fetch';

export const useGetDriverInfo = ({ driverId, opened }: { driverId: string; opened: boolean }) => {
  return useQuery(
    [GET_DRIVER_INFO],
    async () => {
      const result = await fetchUtil({
        reqData: [{ driverId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/getDriverInfo`,
      });
      return result;
    },
    {
      enabled: !!(driverId && opened),
    },
  );
};
