import { randomId } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Company } from "config/types";
import { useUser } from "contexts/userContext/User";
import useUploadImage from "hooks/useUploadImage";
import { t } from 'utils/i18nextFix';
import { useMutation, useQuery } from "react-query";

import fetchUtil from "utils/fetch";

export const useUpdateCompanyInfo = () => {
  const { userDocument, userId } = useUser();

  const uploadCompanyImage = useUploadImage();

  const id = userId;
  const notificationId = randomId();
  return useMutation(["companyInfo", id], async (companyInfo: any) => {
    const { imageObj, ...company } = companyInfo;
    try {
      showNotification({
        message: t("Updating company Info"),
        title: t("In Progress"),
        loading: true,
        autoClose: false,
        id: notificationId,
      });

      if (imageObj) {
        const companyFrontImage = companyInfo.imageObj
          ? await uploadCompanyImage(companyInfo.imageObj)
          : companyInfo.image;

        const result = await fetchUtil({
          reqData: [
            userDocument?.companyDoc,
            { ...company, image: companyFrontImage },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateCompanyInfo`,
        });
        updateNotification({
          message: t("company Info was successfully updated"),
          title: t("Successful"),
          loading: false,
          autoClose: true,
          id: notificationId,
        });
        return result;
      }

      const result = await fetchUtil({
        reqData: [userDocument.companyDoc, { ...company }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateCompanyInfo`,
      });

      updateNotification({
        message: t("company Info was successfully updated"),
        title: t("Successful"),
        loading: false,
        autoClose: true,
        id: notificationId,
      });

      return result;
    } catch (e) {
      updateNotification({
        title: t("Error"),
        message: t("An Error occurred"),
        color: "red",
        autoClose: true,
        id: notificationId,
      });
      console.error(e);
    }
  });
};
