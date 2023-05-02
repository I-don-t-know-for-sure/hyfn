import { randomId } from "@mantine/hooks";

import { useUser } from "contexts/userContext/User";
import { t } from "utils/i18nextFix";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";

import fetchUtil from "utils/fetch";

// export const useUpdateOrderStatus = () => {
//   const { user } = useRealmApp();

//   return useMutation(
//     "Orders",
//     async ({ status, orderId }: { status: string; orderId: string }) => {
//       try {
//         const { country, id } = user?.customData?.storeDoc as {
//           country?: string;
//           id?: string;
//         };
//         //[user?.customData.storeDoc, orderId]
//         // https://jrjtsu634ccvyllh523gnnyzoa0knerr.lambda-url.eu-south-1.on.aws/
//         await fetchUtil({
//           url: "https://ublnivodfwu4zztitbpu5qoyp40kkhzl.lambda-url.eu-south-1.on.aws/",
//           reqData: [{ country, id, status, orderId }],
//           user,
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   );
// };

export const useRejectOrder = () => {
  const { userId, userDocument } = useUser();

  const id = randomId();
  return useMutation(async (orderId: string) => {
    try {
      const {
        storeDoc: { country },
      } = userDocument;
      await fetchUtil({
        url: `${import.meta.env.VITE_APP_BASE_URL}/rejectOrder`,
        reqData: [{ storeId: userDocument?._id, orderId, country }],
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: useRejectOrder.ts:51 ~ returnuseMutation ~ error:",
        error
      );
    }
  });
};
