import { useQuery } from "react-query";
import { fetchApi } from "util/fetch";

export const useGetUserDocument = ({
  userId,
  setUserDocument,
}: {
  userId: string;
  setUserDocument?: (any: any) => void;
}) => {
  return useQuery([userId], async () => {
    try {
      console.log("shshshshjcdjcbdjcbdhcbhdbchbhd");

      if (!userId) {
        throw new Error();
      }
      const userDoc = await fetchApi({
        arg: [userId],
        url: `getCustomerData`,
      });
      console.log(
        "🚀 ~ file: useGetUserDocument.ts:21 ~ returnuseQuery ~ userDoc",
        userDoc
      );
      if (setUserDocument) {
        setUserDocument(userDoc);
      }
      return userDoc;
    } catch (error) {
      throw new Error(error as string);
    }
  });
};
