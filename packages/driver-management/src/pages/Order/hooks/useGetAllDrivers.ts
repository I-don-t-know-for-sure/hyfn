import { useUser } from "contexts/userContext/User";
import { useQuery } from "react-query";
import { fetchApi } from "utils/fetch";

export const useGetAllDrivers = () => {
  const { userDocument } = useUser();
  return useQuery(
    ["getAllDrivers"],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ managementId: userDocument.id }],
          url: `getAllDrivers`,
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
