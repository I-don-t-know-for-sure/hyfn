import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { ObjectId } from 'mongodb';
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getActiveOrdersHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { lastDoc, type, active } = arg[0];
return lastDoc
  // const userDocument = await client
  //   .db('generalData')
  //   .collection('driverManagement')
  //   .findOne({ usersIds: userId }, { projection: { id: 1 } });
  // const { id } = userDocument;
  // console.log(
  //   '🚀 ~ file: getActiveOrders.ts:9 ~ getActiveOrdersHandler ~ lastDoc:',
  //   JSON.stringify({
  //     $and: [
  //       { ...(type === 'all' ? { acceptedProposal: id } : {}) },
  //       {
  //         status: {
  //           $elemMatch: {
  //             status: active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },

  //             userType: USER_TYPE_DRIVER,
  //             ...(type !== 'all' ? { id: type } : {}),
  //           },
  //         },
  //       },
  //     ],
  //   })
  // );
  // if (lastDoc) {
  //   const result = await client
  //     .db('base')
  //     .collection('orders')
  //     .find({
  //       $and: [
  //         {
  //           id: { $gt: new ObjectId(lastDoc) },
  //         },
  //         { ...(type === 'all' ? { acceptedProposal: id } : {}) },
  //         {
  //           'status.status': active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },
  //         },
  //         {
  //           'status.userType': USER_TYPE_DRIVER,
  //         },
  //         type !== 'all' ? { 'status.id': type } : {},
  //       ],
  //     })
  //     .limit(10)
  //     .toArray();
  //   return result;
  // }
  // const result = await client
  //   .db('base')
  //   .collection('orders')
  //   .find({
  //     $and: [
  //       { ...(type === 'all' ? { acceptedProposal: id } : {}) },
  //       {
  //         'status.status': active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },
  //       },
  //       {
  //         'status.userType': USER_TYPE_DRIVER,
  //       },
  //       type !== 'all' ? { 'status.id': type } : {},
  //     ],
  //   })
  //   .limit(10)
  //   .toArray();
  // return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrdersHandler });
};
