import { USER_DOCUMENT } from "hyfn-types";
import { t } from "utils/i18nextFix";
import { useMutation, useQueryClient } from "react-query";

import fetchUtil from "utils/fetch";

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (companyInfo: any) => {
      try {
        const result = await fetchUtil({
          reqData: [companyInfo],
          url: `${import.meta.env.VITE_APP_BASE_URL}/createCompanyDocument`,
        });

        return result;
      } catch (e) {
        console.error(e);
      }
    },
    {
      async onSuccess(data, variables, context) {
        await queryClient.invalidateQueries([USER_DOCUMENT]);
      },
    }
  );
};
