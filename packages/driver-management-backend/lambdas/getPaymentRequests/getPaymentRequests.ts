interface GetPaymentRequestsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { ObjectId } from 'mongodb';

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, userId }: MainFunctionProps) => {
    const { lastDoc } = arg[0];
    const userDocument = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId });
    const { _id } = userDocument;
    if (lastDoc) {
      const results = await client
        .db('generalData')
        .collection('paymentRequests')
        .find({ _id: { $gt: new ObjectId(lastDoc) }, merchantId: _id.toString() })
        .limit(10)
        .toArray();
      return results;
    }
    const results = await client
      .db('generalData')
      .collection('paymentRequests')
      .find({ merchantId: _id.toString() })
      .limit(10)
      .toArray();
    return results;
  };
  return await mainWrapper({ event, mainFunction });
};
