export const updateDriverBalanceHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const session = client.startSession();
  const result = await withTransaction({
    session,
    fn: async () => {
      const userDocument = await client
        .db('generalData')
        .collection('driverManagement')
        .findOne({ userId });
      const { driverId, newBalance /*newCut*/ } = arg[0];
      const newDriverBalance = parseInt(newBalance);
      const {
        _id,
        usedBalance: managementUsedBalance,
        balance: managementBalance,
        verified,
      } = userDocument;
      const availableBalance = subtract(managementBalance, managementUsedBalance);
      if (!verified) {
        const lesser = min(availableBalance, newBalance);
        if (equal(lesser, availableBalance)) {
          throw new Error('You do not have enough balance available');
        }
      }
      const driverDoc = await client
        .db('generalData')
        .collection('driverData')
        .findOne({ _id: new ObjectId(driverId) }, { session });
      // const newManagmentCut = newCut
      //   ? newCut === 1
      //     ? 1
      //     : newCut >= MAXIMUM_MANAGEMENT_CUT
      //     ? MAXIMUM_MANAGEMENT_CUT
      //     : newCut
      //   : driverDoc.managementCut;
      const previousBalance = parseInt(driverDoc.balance);
      const difference = subtract(newDriverBalance, previousBalance);
      if (driverDoc.driverManagement) {
        if (!driverDoc.driverManagement.includes(_id.toString())) {
          throw new Error('this driver is not in your list');
        }
      }
      if (!driverDoc.driverManagement) {
        return new Error('driver is not added by any store');
      }
      await client
        .db('generalData')
        .collection('driverData')
        .updateOne(
          { _id: new ObjectId(driverId) },
          {
            $set: {
              balance: Math.abs(newDriverBalance),
              // managementCut: newManagmentCut,
            },
          },
          { session }
        );
      await client
        .db('generalData')
        .collection('driverManagement')
        .updateOne(
          { userId },
          {
            $inc: {
              usedBalance: difference,
            },
          },
          { session }
        );
      return 'balance was updated';
    },
  });
  await session.endSession();
  return result;
};
interface UpdateDriverBalanceProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
// import { MAXIMUM_MANAGEMENT_CUT } from "hyfn-types";
import { subtract, min, equal } from 'mathjs';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  const result = await mainWrapper({
    event,
    mainFunction: updateDriverBalanceHandler,
  });
  return result;
};
