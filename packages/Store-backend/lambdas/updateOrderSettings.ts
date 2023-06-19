import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { returnsObj } from "hyfn-types";

interface UpdateOrderSettingProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}

export const updateOrderSettings = async ({
  arg,
  userId,
  db
}: UpdateOrderSettingProps) => {
  const { acceptDeliveryOrders, acceptPickupOrders } = arg[0];
  if (!acceptDeliveryOrders && !acceptPickupOrders)
    throw new Error(returnsObj["You must accept at least one order type"]);
  await db
    .updateTable("stores")
    .set({
      acceptDeliveryOrders,
      acceptPickupOrders
    })
    .where("userId", "=", userId)
    .execute();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateOrderSettings });
};
