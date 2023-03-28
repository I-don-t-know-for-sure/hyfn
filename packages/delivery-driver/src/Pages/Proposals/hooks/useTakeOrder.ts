import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useLocation } from "contexts/locationContext/LocationContext";
import { useUser } from "contexts/userContext/User";
import { useMutation } from "react-query";
import fetchUtil from "utils/fetch";
import { t } from "utils/i18nextFix";

export const useTakeOrder = () => {
  const { userDocument: user } = useUser();

  const [{ country }] = useLocation();
  const id = randomId();
  return useMutation(
    ["takeOrder"],
    async ({ orderId }: { orderId: string }) => {
      try {
        console.log("hshshshs");
        showNotification({
          title: t("In progress"),
          message: t("Processing"),
          loading: true,
          autoClose: false,
          id,
        });
        const result = await fetchUtil({
          reqData: [
            {
              driverId: user?._id,
              country,
              orderId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/takeOrder`,
        });
        updateNotification({
          message: t("Success"),
          id,
          color: "green",
          loading: false,
          autoClose: true,
        });
        console.log(result, "hfhfh");

        return result;
      } catch (e: any) {
        updateNotification({
          message: t("An Error occurred"),
          id,
          color: "red",
          loading: false,
          autoClose: true,
        });
        console.error(e);
      }
    }
  );
};
