import { NotificationProps } from "@mantine/notifications";

export * from "./components";
export * from "./hooks";
export * from "./functions";
export const loadingNotification: NotificationProps = {
  title: "",
  loading: true,
  color: "green",
  message: "",
  autoClose: false,
};

export const errorNotification: NotificationProps = {
  title: "",
  loading: false,
  color: "red",
  message: "",
  autoClose: true,
};

export const successNotification: NotificationProps = {
  title: "",
  loading: false,
  color: "green",
  message: "",
  autoClose: true,
};
