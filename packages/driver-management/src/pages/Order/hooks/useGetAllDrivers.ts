import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";
import fetchUtil from "utils/fetch";

export const useGetAllDrivers = () => {
  const { userDocument } = useUser();
  return useQuery(
    ["getAllDrivers"],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [{ managementId: userDocument.id }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getAllDrivers`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGetAllDrivers.ts:8 ~ returnuseQuery ~ error:",
          error
        );
      }
    },
    {}
  );
};
