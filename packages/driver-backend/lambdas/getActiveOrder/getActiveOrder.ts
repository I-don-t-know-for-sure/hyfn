export const getActiveOrderHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { driverId, orderId, country } = arg[0];
  // await argValidations(arg);
  result = await client
    .db('base')
    .collection('orders')
    .findOne(
      {
        _id: new ObjectId(orderId),
      },
      {}
    );
  console.log('');
  console.log('');
  const sameDriverId = result.status.find((status) => {
    return status._id === driverId;
  });
  if (sameDriverId) {
    return result;
  } else {
    throw new Error('not same driver');
  }
};
interface GetActiveOrderProps extends Omit<MainFunctionProps, 'arg'> {}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrderHandler });
};
