import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useRemoveDriverFromManagementDrivers = () => {
  return useMutation(async ({ driverId }: { driverId: string }) => {
    return fetchApi({
      arg: [{ driverId, management: "stores" }],

      url: `removeFromManagementDrivers`,
    });
  });
};
