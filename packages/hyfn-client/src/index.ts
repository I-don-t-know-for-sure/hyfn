import { NotificationProps } from "@mantine/notifications";

export * from "./components";
export * from "./hooks";
export * from "./functions";
export * from "./context";
export * from "./pages";
// export * from "@mantine/notifications";
export * from "@mantine/core";

// export { NotificationProps };

export * from "@mantine/carousel";
export * from "@mantine/hooks";
export * from "@mantine/tiptap";

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
