import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateBrand = () => {
  const { userDocument } = useUser();
  const id = randomId();
  return useMutation(async ({ brandInfo }: { brandInfo: any }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ creatorId: userDocument._id, brandInfo }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createBrand`,
      });
      return result;
    } catch (error) {
      throw error;
    }
  });
};
