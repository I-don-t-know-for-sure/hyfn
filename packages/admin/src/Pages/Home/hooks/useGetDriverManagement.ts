import { useQuery } from "react-query";
import { fetchApi } from "../../../utils/fetch";

export const useGetDriverManagement = ({
  driverManagement,
}: {
  driverManagement: string;
}) => {
  return useQuery(
    [],
    async () => {
      try {
        const result = await fetchApi({
          arg: [{ driverManagement }],
          url: `getDriverManagement`,
        });
        return result;
      } catch (error) {
        console.error(error);
        throw new Error("error");
      }
    },
    { enabled: false }
  );
};
