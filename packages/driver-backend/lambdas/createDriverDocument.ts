('use strict');
interface CreateDriverDocumentProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const createDriverDocumentHandler = async ({
  arg,
  session,
  client,
  event,
}: CreateDriverDocumentProps) => {
  var result;
  const { balance, ...driverInfo } = arg[0];
  const driverId = arg[1];
  // TODO remove this arg
  // const { accessToken, userId } = arg[2];
  const passportNumber = driverInfo?.passportNumber?.replace(/\s/g, '');
  const details = await client
    .db('generalData')
    .collection('driverData')
    .insertOne(
      {
        ...driverInfo,
        driverId: driverId,
        passportNumber,
        verified: false,
      },
      {}
    );
  // await client
  //   .db('generalData')
  //   .collection('driverVerification')
  //   .insertOne({ ...driverInfo, driverId: driverId });
  console.log(details, 'djdjddjdjd');
  result = 'success';
  return result;
};
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createDriverDocumentHandler });
};
