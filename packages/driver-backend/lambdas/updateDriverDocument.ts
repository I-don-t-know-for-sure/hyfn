export const updateDriverDocumentHandler = async ({
  arg,
  client,
  db,
  userId,
}: MainFunctionProps) => {
  // const driverInfo = await driverInfoSchema.validate(arg[1]);
  const { id, driverId, balance, ...driverInfo } = await arg[1];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (driverDoc.verified) {
    throw new Error('You can not change your data after verification');
  }

  await db
    .updateTable('drivers')
    .set({
      driverName: driverInfo.driverName,
      driverPhone: driverInfo.driverPhone,
      tarnsportationMethod: driverInfo.tarnsportationMethod,
    })
    .where('userId', '=', userId)
    .executeTakeFirst();
  return 'success';
};
interface UpdateDriverDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateDriverDocumentHandler });
};
