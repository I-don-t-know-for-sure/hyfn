import { randomId } from "@mantine/hooks";

import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";
import { t } from "utils/i18nextFix";

export const useTakeOrder = () => {
  const { userDocument: user } = useUser();

  const [{ country }] = useLocation();
  const id = randomId();
  return useMutation(
    ["takeOrder"],
    async ({ orderId }: { orderId: string }) => {
      try {
        const result = await fetchApi({
          arg: [
            {
              driverId: user?.id,
              country,
              orderId,
            },
          ],
          url: `takeOrder`,
        });

        return result;
      } catch (e: any) {
        console.error(e);
      }
    }
  );
};
