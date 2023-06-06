import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

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
      return await fetchApi({
        arg: [{ newBalance, driverId, newCut, management: "stores" }],
        url: `updateDriverBalance`,
      });
    }
  );
};
