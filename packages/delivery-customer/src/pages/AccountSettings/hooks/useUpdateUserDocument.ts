import { useUser } from "../../../contexts/userContext/User";
import { t } from "util/i18nextFix";
import { useMutation, useQueryClient } from "react-query";
import fetchUtil from "util/fetch";

const useUpdateUserDocument = () => {
  const queryClient = useQueryClient();
  const { userId, userDocument, isLoading, refetch } = useUser();

  return useMutation(
    async ({ newUserInfo }: { newUserInfo: any }) => {
      try {
        const userDocExist = Object.keys(userDocument).length > 0;

        const result = userDocExist
          ? await fetchUtil({
              reqData: [userDocument?._id, newUserInfo],

              url: `${import.meta.env.VITE_APP_BASE_URL}/updateUserDocument`,
            })
          : console.log("shshshsh");

        return result;
      } catch (error) {}
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([userId]);
      },
    }
  );
};

export default useUpdateUserDocument;
