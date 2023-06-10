export const updateManagementInfoHandler = async ({
  arg,
  client,
  session,
  userId,
  db
}: MainFunctionProps) => {
  const { balance, usedBalance, ...newInfo } = arg[0];

  await db
    .updateTable("driverManagements")
    .set({
      country: newInfo.country,
      managementAddress: newInfo.managementAddress,
      managementName: newInfo.managementName,
      managementPhone: newInfo.managementPhone,
      deliverFrom: newInfo.deliverFrom,
      deliverTo: newInfo.deliverTo
    })
    .where("userId", "=", userId)
    .executeTakeFirst();
  return returnsObj["seccess"];
};
interface UpdateManagementInfoProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { returnsObj } from "hyfn-types";
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: updateManagementInfoHandler
  });
};
