import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { DRIVER_STATUS_IN_PROGRESS, DRIVER_STATUS_NOT_SET, USER_TYPE_DRIVER } from 'hyfn-types';
import { ObjectId } from 'mongodb';
interface GetActiveOrdersProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const getActiveOrdersHandler = async ({ arg, client, userId }: MainFunctionProps) => {
  const { lastDoc, type, active } = arg[0];

  const userDocument = await client
    .db('generalData')
    .collection('driverManagement')
    .findOne({ userId }, { projection: { _id: 1 } });
  const { _id } = userDocument;
  console.log(
    '🚀 ~ file: getActiveOrders.ts:9 ~ getActiveOrdersHandler ~ lastDoc:',
    JSON.stringify({
      $and: [
        { ...(type === 'all' ? { acceptedProposal: _id.toString() } : {}) },
        {
          status: {
            $elemMatch: {
              status: active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },

              userType: USER_TYPE_DRIVER,
              ...(type !== 'all' ? { _id: type } : {}),
            },
          },
        },
      ],
    })
  );
  if (lastDoc) {
    const result = await client
      .db('base')
      .collection('orders')
      .find({
        $and: [
          {
            _id: { $gt: new ObjectId(lastDoc) },
          },
          { ...(type === 'all' ? { acceptedProposal: _id.toString() } : {}) },
          {
            'status.status': active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },
          },
          {
            'status.userType': USER_TYPE_DRIVER,
          },
          type !== 'all' ? { 'status._id': type } : {},
        ],
      })
      .limit(10)
      .toArray();
    return result;
  }
  const result = await client
    .db('base')
    .collection('orders')
    .find({
      $and: [
        { ...(type === 'all' ? { acceptedProposal: _id.toString() } : {}) },
        {
          'status.status': active ? DRIVER_STATUS_NOT_SET : { $ne: DRIVER_STATUS_NOT_SET },
        },
        {
          'status.userType': USER_TYPE_DRIVER,
        },
        type !== 'all' ? { 'status._id': type } : {},
      ],
    })
    .limit(10)
    .toArray();
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getActiveOrdersHandler });
};
