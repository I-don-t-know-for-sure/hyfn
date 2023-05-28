export const updateManagementInfoHandler = async ({
  arg,
  client,
  session,
  userId,
  db,
}: MainFunctionProps) => {
  const { balance, usedBalance, ...newInfo } = arg[0];

  await db
    .updateTable('driverManagements')
    .set({
      country: newInfo.country,
      managementAddress: newInfo.managementAddress,
      managementName: newInfo.managementName,
      managementPhone: newInfo.managementPhone,
      // verified: true,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  return 'seccess';
};
interface UpdateManagementInfoProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: updateManagementInfoHandler,
  });
};
