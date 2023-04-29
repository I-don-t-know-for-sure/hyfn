import { MainFunctionProps, createLocalCardConfigurationObject, mainWrapper } from 'hyfn-server';
import { adminName, hyfnPlusSubscriptionPrice } from 'hyfn-types';
import { getAdminLocalCardCreds } from 'lambdas/common/getAdminLocalCardCreds';
import { ObjectId } from 'mongodb';

interface CreateSubscriptionTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const createSubscriptionHnadler = async ({
  arg,
  client,
  userId,
}: CreateSubscriptionTransactionProps) => {
  const { numberOfMonths } = arg[0];
  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId });
  const amount = numberOfMonths * hyfnPlusSubscriptionPrice;
  const now = new Date();
  const transactionId = new ObjectId();
  await client.db('generalData').collection('transactions').insertOne({
    customerId: customerDoc._id.toString(),
    amount,
    _id: transactionId,
    storeId: adminName,
    transactionDate: now,
    validated: false,
    type: 'subscription',
    numberOfMonths,
  });
  await client
    .db('generalData')
    .collection('customerInfo')
    .updateOne(
      { _id: new ObjectId(customerDoc._id.toString()) },
      {
        $set: {
          transactionId,
        },
      }
    );
  const { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  const configurationObject = await createLocalCardConfigurationObject({
    amount,
    includeLocalCardTransactionFeeToPrice: true,
    now,
    transactionId: transactionId,
    MerchantId,
    secretKey,
    TerminalId,
  });
  return { configurationObject };
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createSubscriptionHnadler });
};
