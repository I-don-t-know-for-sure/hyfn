import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { returnsObj } from 'hyfn-types';
interface CreateManagementProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createManagementHandler = async ({
  arg,
  client,
  userId,
  db,
}: CreateManagementProps) => {
  const { balance, ...managerInfo } = arg[0];

  await db
    .insertInto('driverManagements')
    .values({
      country: managerInfo.country,
      userId,
      usersIds: [userId],
      users: [{ userId, userType: 'owner' }],
      managementAddress: managerInfo.managementAddress,
      managementName: managerInfo.managementName,
      managementPhone: managerInfo.managementPhone,
      verified: false,
    })
    .execute();
  return returnsObj['sucess'];
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createManagementHandler });
};
