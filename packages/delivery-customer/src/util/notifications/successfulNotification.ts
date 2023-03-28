import { randomId } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { t } from 'util/i18nextFix';;
import { Notification } from "./types";

export const successfulNotification = ({
  autoClose = true,
  message,
  title,
  loading = false,
}: Notification) => {
  const id = randomId();

  showNotification({
    message: t(message),
    title: t(title),
    id,
    color: "green",
    autoClose,
    loading,
  });
  return id;
};
