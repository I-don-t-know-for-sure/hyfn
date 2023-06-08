import { useMutation } from "react-query";
import { fetchApi } from "utils/fetch";

export const useCancelTransaction = () => {
  return useMutation(async () => {
    return await fetchApi({
      url: "cancelTransaction",
      arg: [{ flag: "stores" }],
    });
  });
};
