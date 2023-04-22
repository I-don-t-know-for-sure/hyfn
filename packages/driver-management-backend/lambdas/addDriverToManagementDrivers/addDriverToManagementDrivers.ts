('use strict');
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
const { ObjectId } = require('mongodb');
const { subtract, smallerEq, smaller } = require('mathjs');
interface AddDriverToManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const addDriverToManagementDriversHandler = async ({
  arg,
  client,
  userId,
  session,
}: MainFunctionProps) => {
  const { driverId, balance } = arg[0];
  const userDocument = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ userId }, { session });
  const trustedBalance = parseFloat(balance);
  console.log(
    '🚀 ~ file: addDriverToStoreDrivers.js:14 ~ mainFunction ~ trustedBalance',
    trustedBalance
  );
  const {
    _id,
    // usedBalance: managementUsedBalance,
    // balance: managementBalance,
    verified,
  } = userDocument;
  // const managementUsedBalanceFloat = parseFloat(managementUsedBalance.toFixed(3));
  // console.log(
  //   '🚀 ~ file: addDriverToManagementDrivers.js:20 ~ mainFunction ~ managementUsedBalanceInt',
  //   managementUsedBalanceFloat
  // );
  // const availableBalance = subtract(managementBalance, managementUsedBalanceFloat);
  const managementId = _id.toString();
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ _id: new ObjectId(driverId) }, { session });
  // const managementDoc = await client
  //     .db('generalData')
  //     .collection('driverManagement')
  //     .findOne({ _id: new ObjectId(managementId) }, { session });
  const storeTrustsDriver = driverDoc?.driverManagement?.length > 0;

  if (storeTrustsDriver) {
    throw new Error('this driver is trusted');
  }
  console.log('bchdbchdbcbd');
  if (!verified) {
    // if (smaller(availableBalance, trustedBalance)) {
    throw new Error('You do not have enough balance available');
    // }
  }
  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      { _id: new ObjectId(driverId) },
      {
        $push: {
          driverManagement: managementId,
        },
        $set: {
          balance: trustedBalance,
          verified: true,
          // managementCut: managementDoc.managementCut,
        },
      },
      { session }
    );

  // await client
  //   .db('generalData')
  //   .collection('driverManagement')
  //   .updateOne(
  //     { userId },
  //     {
  //       $inc: {
  //         usedBalance: Math.abs(trustedBalance),
  //       },
  //     },
  //     { session }
  //   );
  return 'driver was Add to trusted list';
};
export const handler = async (event) => {
  const result = await mainWrapperWithSession({
    event,
    mainFunction: addDriverToManagementDriversHandler,
    withUserDocument: true,
  });
  return result;
};
