import { useMutation } from "react-query";
import fetchUtil from "../../../utils/fetch";
import { useUser } from "../../../contexts/userContext/User";

export const useCreateAdmin = () => {
  const { userId } = useUser();

  return useMutation(async ({ adminInfo }: { adminInfo: any }) => {
    try {
      const result = await fetchUtil({
        reqData: [{ ...adminInfo, userId }],
        url: `${import.meta.env.VITE_APP_BASE_URL}/createAdminDocument`,
      });

      return result;
    } catch (error) {
      console.log(
        "🚀 ~ file: useCreateAdmin.ts:8 ~ returnuseMutation ~ error",
        error
      );
    }
  });
};
