import { MainFunctionProps, mainWrapper } from 'hyfn-server';

const { ObjectId } = require('mongodb');

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    const { requestId } = arg[0];
    const userDocument = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne(
        { userId },
        {
          projection: {
            _id: 1,
          },
        }
      );
    const { _id } = userDocument;
    await client
      .db('generalData')
      .collection('paymentRequests')
      .deleteOne(
        { _id: new ObjectId(requestId), merchantId: _id.toString(), validated: false },
        {}
      );
    return 'success';
  };
  return await mainWrapper({ event, mainFunction });
};
