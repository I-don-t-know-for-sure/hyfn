import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { returnsObj } from "hyfn-types";

interface SetDeliveryFeeProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}

export const setDeliveryFee = async ({
  arg,
  userId,
  db
}: SetDeliveryFeeProps) => {
  const { deliveryFee, orderId } = arg[0];

  await db.transaction().execute(async (trx) => {
    const order = await trx
      .selectFrom("orders")
      .select(["id", "storeStatus"])
      .where("id", "=", orderId)
      .executeTakeFirstOrThrow();
    if (order.storeStatus.includes("paid"))
      throw new Error(returnsObj["Store is already paid"]);
    await trx
      .updateTable("orders")
      .set({
        deliveryFee
      })
      .where("id", "=", orderId)
      .execute();
  });
  return returnsObj["success"];
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setDeliveryFee });
};
