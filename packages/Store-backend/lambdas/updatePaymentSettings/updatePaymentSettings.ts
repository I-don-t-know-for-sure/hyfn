interface UpdatePaymentSettingsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event, ctx) => {
  const mainFunction = async ({ arg, client }) => {
    var result;

    const { storeId, userId } = arg[0];

    const storeDoc = await client
      .db('generalData')
      .collection('storeInfo')
      .findOne(
        {
          _id: new ObjectId(storeId),
        },
        {}
      );

    await client
      .db('generalData')
      .collection('storeInfo')
      .updateOne(
        {
          _id: new ObjectId(storeId),
        },
        {
          $set: {
            automaticPayments: !storeDoc.automaticPayments,
          },
        },
        {}
      );
    result = 'success';

    return result;
  };
  return await mainWrapper({ event, ctx, mainFunction });
  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
