import { showNotification } from "@mantine/notifications";
import { t } from 'util/i18nextFix';;
import { Notification } from "./types";

export const successfulNotification = ({
  autoClose = true,
  message,
  title,
  loading = false,
  id,
}: Notification) => {
  showNotification({
    message: t(message),
    title: t(title),
    id,
    color: "red",
    autoClose,
    loading,
  });
};
