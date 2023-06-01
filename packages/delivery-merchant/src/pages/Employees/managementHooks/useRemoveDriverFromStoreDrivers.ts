import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useRemoveDriverFromManagementDrivers = () => {
  return useMutation(async ({ driverId }: { driverId: string }) => {
    return fetchUtil({
      reqData: [{ driverId, management: "stores" }],

      url: `${
        import.meta.env.VITE_APP_BASE_URL
      }/removeDriverFromManagementDrivers`,
    });
  });
};
