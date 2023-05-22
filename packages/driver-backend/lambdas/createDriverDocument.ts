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

  // TODO remove this arg
  // const { accessToken, userId } = arg[2];

  await db
    .insertInto('drivers')
    .values({
      driverName: driverInfo.driverName,
      userId,
      verified: false,
      driverPhone: driverInfo.driverPhone,
    })
    .executeTakeFirst();
  // await client
  //   .db('generalData')
  //   .collection('driverVerification')
  //   .insertOne({ ...driverInfo, driverId: driverId });

  result = 'success';
  return result;
};
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createDriverDocumentHandler });
};
