('use strict');

import { mainWrapper } from 'hyfn-server';
import { MainFunctionProps } from 'hyfn-server';
import { z } from 'zod';
import { updateAllOrder } from './common/updateAllOrder';
import { returnsObj } from 'hyfn-types';
interface CreateOrderDataProps extends Omit<MainFunctionProps, 'args'> {
  arg: any[];
}
export const createOrderData = async ({ arg, client, userId, db }: CreateOrderDataProps) => {
  const customerDoc = await db
    .selectFrom('customers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const orderCart = arg[0];
  const buyerInfo = arg[1];
  const metchesOrder = orderCart[0];

  if (!Array.isArray(orderCart)) {
    throw new Error(returnsObj['wrong']);
  }
  if (orderCart.length > 4) {
    throw new Error(returnsObj['only 4 stores are allowed in an order']);
  }
  const orderTypesDifferent = orderCart.some((store) => {
    return store.orderType !== orderCart[0].orderType;
  });
  if (orderTypesDifferent) {
    throw new Error('stores in order can`t have orderType of delivery and pickup');
  }

  await updateAllOrder({ arg, client, customerDoc, db });

  return JSON.stringify('success');
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createOrderData });
};
