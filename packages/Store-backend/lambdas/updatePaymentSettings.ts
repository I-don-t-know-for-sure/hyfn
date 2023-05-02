export const updatePaymentSettingsHandler = async ({ arg, client }) => {
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
interface UpdatePaymentSettingsProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updatePaymentSettingsHandler });
};
