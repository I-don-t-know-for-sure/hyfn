import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";

import { useMutation, useQueryClient } from "react-query";

import { fetchApi } from "utils/fetch";

const useUpdateStoreOwnerInfo = () => {
  const { userDocument } = useUser();
  const notificationId = randomId();

  return useMutation([], async (storeInfo: any) => {
    try {
      const result = await fetchApi({
        arg: [userDocument.storeDoc, { ...storeInfo }],
        url: `updateStoreOwnerInfo`,
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
