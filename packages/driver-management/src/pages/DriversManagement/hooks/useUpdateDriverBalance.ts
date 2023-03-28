import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useUpdateDriverBalance = () => {
  return useMutation(
    async ({
      newBalance,
      driverId,
      newCut,
    }: {
      newBalance: number;
      driverId: string;
      newCut: number;
    }) => {
      return await fetchUtil({
        reqData: [{ newBalance, driverId, newCut }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateDriverBalance`,
      });
    }
  );
};
