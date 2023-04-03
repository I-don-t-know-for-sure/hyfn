import { MongoClient } from 'mongodb';
export const getCustomerInfo = async ({
  client,
  userId,
  options,
}: {
  client: MongoClient;
  options: {
    projection: any;
    session: any;
  };
  userId: string;
}) => {
  const result = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId }, { ...options });
  if (!result) {
    throw new Error('customer not found');
  }
  return result;
};
