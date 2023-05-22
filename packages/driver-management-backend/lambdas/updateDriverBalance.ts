export const updateDriverBalanceHandler = async ({
  arg,
  client,
  userId,
  db,
}: MainFunctionProps) => {
  const result = await db.transaction().execute(async (trx) => {
    const userDocument = await trx
      .selectFrom('driverManagements')
      .selectAll()
      .where('userId', '=', userId)
      .executeTakeFirstOrThrow();
    const { driverId, newBalance /*newCut*/ } = arg[0];
    const newDriverBalance = parseInt(newBalance);
    const {
      id,

      verified,
    } = userDocument;

    if (!verified) {
      throw new Error('You are not verified');
    }

    const driverDoc = await trx
      .selectFrom('drivers')
      .selectAll()
      .where('id', '=', driverId)
      .executeTakeFirstOrThrow();
    // const newManagmentCut = newCut
    //   ? newCut === 1
    //     ? 1
    //     : newCut >= MAXIMUM_MANAGEMENT_CUT
    //     ? MAXIMUM_MANAGEMENT_CUT
    //     : newCut
    //   : driverDoc.managementCut;
    const previousBalance = parseInt(driverDoc.balance as any);
    const difference = subtract(newDriverBalance, previousBalance);

    if (driverDoc.driverManagement !== id) {
      throw new Error('this driver is not in your list');
    }

    await trx
      .updateTable('drivers')
      .set({
        balance: newDriverBalance,
      })
      .where('id', '=', driverId)
      .execute();
    return 'balance was updated';
  });
  return result;
};
interface UpdateDriverBalanceProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper, withTransaction } from 'hyfn-server';
import { sql } from 'kysely';
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
