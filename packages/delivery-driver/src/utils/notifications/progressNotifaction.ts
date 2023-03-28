import { randomId } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { t } from 'utils/i18nextFix';
import { Notification } from "./types";

export const progressNotification = ({
  autoClose = false,
  message,
  title,
  loading = true,
}: Notification) => {
  const id = randomId();

  showNotification({
    message: t(message),
    title: t(title),
    id,
    color: "blue",
    autoClose,
    loading,
  });
  return id;
};
