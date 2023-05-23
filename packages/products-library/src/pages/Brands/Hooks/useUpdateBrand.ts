import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useMutation } from "react-query";

import fetchUtil from "utils/fetch";

export const useUpdateBrand = () => {
  const { userDocument } = useUser();

  const id = randomId();
  return useMutation(
    async ({ brandInfo, brandId }: { brandInfo: any; brandId: string }) => {
      try {
        const result = await fetchUtil({
          reqData: [
            {
              creatorId: userDocument.id,
              newBrandInfo: brandInfo,
              brandId,
            },
          ],
          url: `${import.meta.env.VITE_APP_BASE_URL}/updateBrand`,
        });
        return result;
      } catch (error) {
        throw error;
      }
    }
  );
};
