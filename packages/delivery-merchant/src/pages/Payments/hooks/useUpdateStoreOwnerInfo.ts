import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";

import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

const useUpdateStoreOwnerInfo = () => {
  const { userDocument } = useUser();
  const notificationId = randomId();

  return useMutation([], async (storeInfo: any) => {
    try {
      const result = await fetchUtil({
        reqData: [userDocument.storeDoc, { ...storeInfo }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/updateStoreOwnerInfo`,
      });
      // await user?.functions.updateStoreOwnerInfo([
      //   user?.customData.storeDoc,
      //   { ...storeInfo },
      // ]);
    } catch (e) {
      console.error(e);
    }
  });
};

export default useUpdateStoreOwnerInfo;
