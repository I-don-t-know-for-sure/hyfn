import { useMutation } from "react-query";
import { fetchApi } from "../../../utils/fetch";
import { useUser } from "../../../contexts/userContext/User";

export const useCreateAdmin = () => {
  const { userId } = useUser();

  return useMutation(async ({ adminInfo }: { adminInfo: any }) => {
    try {
      const result = await fetchApi({
        arg: [{ ...adminInfo, userId }],
        url: `createAdminDocument`,
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
