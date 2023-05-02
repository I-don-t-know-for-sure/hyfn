import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { Dispatch, SetStateAction } from "react";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useAddToTopUp = () => {
  const { userDocument: user, refetch } = useUser();

  const id = randomId();
  return useMutation(
    async ({
      amountToBeAdded,
      OTP,
    }: {
      OTP: string;
      amountToBeAdded: number;
    }) => {
      try {
        console.log(JSON.stringify([{ customerId: user.id, OTP }]));

        const res = await fetchUtil({
          reqData: [{ customerId: user.driverId, OTP, amountToBeAdded }],
          url: import.meta.env.VITE_APP_ADD_TO_TOP_UP,
          user,
        });

        refetch();
        return res;
      } catch (e) {
        console.error(e);
      }
    }
  );
};
