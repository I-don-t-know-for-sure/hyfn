import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { driverDoc } from "hyfn-types";

import useUploadImage from "hooks/useUploadImage";
import { t } from "utils/i18nextFix";
import { useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

const useExample = () => {
  const id = randomId();
  return useQuery([driverDoc], async () => {
    try {
      showNotification({
        title: t(""),
        message: t(""),
        id,
        loading: true,
        autoClose: false,
      });

      updateNotification({
        title: t(""),
        message: t(""),
        id,
        loading: false,
        autoClose: true,
        color: "green",
      });
    } catch (error) {
      updateNotification({
        title: t("Error"),
        message: t("An Error occurred"),
        id,
        loading: false,
        autoClose: true,
        color: "red",
      });
    }
  });
};
