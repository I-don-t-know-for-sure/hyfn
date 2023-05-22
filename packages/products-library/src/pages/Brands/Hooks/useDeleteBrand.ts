import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useDeleteBrand = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useMutation(async ({ brandId }: { brandId: string }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ creatorId: userDocument._id, brandId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/deleteBrand`,
      });
      return result;
    } catch (error) {
      throw error;
    }
  });
};
