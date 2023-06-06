import { useMutation } from "react-query";

import { fetchApi } from "utils/fetch";

export const useDeleteLocalCardAPIKey = () => {
  return useMutation(async () => {
    return await fetchApi({
      arg: [],
      url: `deleteLocalCardAPIKey`,
    });
  });
};
