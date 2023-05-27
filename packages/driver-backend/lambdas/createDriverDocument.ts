('use strict');
interface CreateDriverDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createDriverDocumentHandler = async ({
  arg,
  session,
  client,
  event,
  userId,
  db,
}: CreateDriverDocumentProps) => {
  var result;
  const { balance, ...driverInfo } = arg[0];

  await db
    .insertInto('drivers')
    .values({
      driverName: driverInfo.driverName,
      userId,
      verified: false,
      driverPhone: driverInfo.driverPhone,
      notificationTokens: [],
      reportsIds: [],
      tarnsportationMethod: driverInfo.tarnsportationMethod,
      balance: 0,
      usedBalance: 0,
    })
    .executeTakeFirst();

  result = 'success';
  return result;
};
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createDriverDocumentHandler });
};
