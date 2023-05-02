('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
const { ObjectId } = require('mongodb');
const { subtract, smallerEq, smaller } = require('mathjs');
interface AddDriverToManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const addDriverToManagementDriversHandler = async ({
  arg,
  client,
  userId,
}: MainFunctionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const { driverId, balance } = arg[0];
      const userDocument = await client
        .db('generalData')
        .collection('driverManagement')
        .findOne({ userId }, { session });
      const trustedBalance = parseFloat(balance);

      const {
        _id,

        verified,
      } = userDocument;

      const managementId = _id.toString();
      const driverDoc = await client
        .db('generalData')
        .collection('driverData')
        .findOne({ _id: new ObjectId(driverId) }, { session });

      const storeTrustsDriver = driverDoc?.driverManagement?.length > 0;

      if (storeTrustsDriver) {
        throw new Error('this driver is trusted');
      }
      console.log('bchdbchdbcbd');
      if (!verified) {
        // if (smaller(availableBalance, trustedBalance)) {
        throw new Error('You are not verified');
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

      return 'driver was Add to trusted list';
    },
  });
  await session.endSession();
  return result;
};
export const handler = async (event) => {
  const result = await mainWrapper({
    event,
    mainFunction: addDriverToManagementDriversHandler,
    withUserDocument: true,
  });
  return result;
};
