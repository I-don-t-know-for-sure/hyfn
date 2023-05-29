import { USER_STATUS_DELIVERED, USER_TYPE_DRIVER } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
import { add, largerEq, smaller } from 'mathjs';
import { sql } from 'kysely';
import { returnsObj } from 'hyfn-types';
interface ReplaceOrderDriverProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const replaceOrderDriverHandler = async ({
  arg,
  client,
  userId,
  db,
}: ReplaceOrderDriverProps) => {
  const { orderId, newDriverId, oldDriverId } = arg[0];

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();

  // const oldDriver = orderDoc.status.find((status) => {})

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('id', '=', newDriverId)
    .executeTakeFirstOrThrow();

  // check if the newdriver has enough balance
  if (smaller(driverDoc.balance, add(driverDoc.usedBalance || 0, orderDoc.orderCost as any))) {
    throw new Error(returnsObj['not enough balance']);
  }

  await db
    .updateTable('drivers')
    .set({
      usedBalance: sql`used_balance + ${orderDoc.orderCost}`,
    })
    .where('id', '=', newDriverId)
    .execute();

  await db
    .updateTable('orders')
    .set({
      driverId: newDriverId,
      driverStatus: [...orderDoc.driverStatus, 'set'],
    })
    .where('id', '=', orderId)
    .execute();

  await db
    .updateTable('drivers')
    .set({
      usedBalance: sql`used_balance - ${orderDoc.orderCost}`,
    })
    .where('id', '=', oldDriverId)
    .execute();
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: replaceOrderDriverHandler });
};
