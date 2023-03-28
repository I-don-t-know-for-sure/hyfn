import { useMutation, useQuery } from "react-query";
import fetchUtil from "../../../utils/fetch";

export const useGetDriverManagement = ({
  driverManagement,
}: {
  driverManagement: string;
}) => {
  return useQuery(
    [],
    async () => {
      try {
        const result = await fetchUtil({
          reqData: [{ driverManagement }],
          url: `${import.meta.env.VITE_APP_BASE_URL}/getDriverManagement`,
        });
        return result;
      } catch (error) {
        console.log(
          "🚀 ~ file: useGetDriverManagement.ts:8 ~ returnuseMutation ~ error",
          error
        );
        throw new Error("error");
      }
    },
    { enabled: false }
  );
};
