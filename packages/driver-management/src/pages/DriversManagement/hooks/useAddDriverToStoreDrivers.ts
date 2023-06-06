import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useAddDriverToManagementDrivers = () => {
  const { userId, userDocument } = useUser();

  return useMutation(
    async ({ driverId, balance }: { driverId: string; balance: number }) => {
      return await fetchApi({
        arg: [{ driverId, storeId: userDocument.id, balance }],
        url: `addDriverToManagementDrivers`,
      });
    }
  );
};
