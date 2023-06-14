import axios from "axios";

export function sendRemoveBackgroundsEventBus({
  productIds,
  storeId
}: {
  productIds: any[];
  storeId: string;
}) {
  axios
    .post(process.env.removeBackgroundsURL, {
      productIds,
      storeId,
      url: process.env.removeBackgroundsURL
    })
    .catch((err) => {
      console.log("🚀 ~ file: removeBackgrounds.ts:17 ~ err:", err);
      console.error(err);
    });
}
export const removeBackgrounds = async ({
  productIds,
  storeId
}: {
  productIds: string[];
  storeId: string;
}) => {
  sendRemoveBackgroundsEventBus({ productIds, storeId });
};
