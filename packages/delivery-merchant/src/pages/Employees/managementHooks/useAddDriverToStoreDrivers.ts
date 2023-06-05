import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useAddDriverToManagementDrivers = () => {
  const { userId, userDocument } = useUser();

  return useMutation(
    async ({ driverId, balance }: { driverId: string; balance: number }) => {
      return await fetchUtil({
        reqData: [
          { driverId, storeId: userDocument.id, balance, management: "stores" },
        ],
        url: `${
          import.meta.env.VITE_APP_BASE_URL
        }/addDriverToManagementDrivers`,
      });
    }
  );
};