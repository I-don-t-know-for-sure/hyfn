('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
const { ObjectId } = require('mongodb');
const { subtract, smallerEq, smaller } = require('mathjs');
import { returnsObj } from 'hyfn-types';
interface AddDriverToManagementDriversProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const addDriverToManagementDriversHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const result = db.transaction().execute(async (trx) => {
    const { driverId, balance } = arg[0];

    const userDocument = await trx
      .selectFrom('driverManagements')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    const trustedBalance = parseFloat(balance);

    const {
      id,

      verified,
    } = userDocument;

    const managementId = id.toString();

    const driverDoc = await trx
      .selectFrom('drivers')
      .selectAll()
      .where('id', '=', driverId)
      .executeTakeFirstOrThrow();

    if (driverDoc?.driverManagement) {
      throw new Error(returnsObj['this driver is trusted']);
    }
    console.log('bchdbchdbcbd');
    if (!verified) {
      // if (smaller(availableBalance, trustedBalance)) {
      throw new Error(returnsObj['You are not verified']);
      // }
    }

    await trx
      .updateTable('drivers')
      .set({
        balance: trustedBalance,
        verified: true,
        driverManagement: managementId,
      })
      .where('id', '=', driverId)
      .execute();
    return returnsObj['driver was Add to trusted list'];
  });
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
