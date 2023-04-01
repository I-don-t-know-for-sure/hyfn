interface CreatePaymentRequestProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapperWithSession } from 'hyfn-server';
import { adminName } from 'hyfn-types';

const { equal, add, smaller } = require('mathjs');

export const handler = async (event) => {
  const mainFunction = async ({ arg, client, session, userId }: MainFunctionProps) => {
    const { amount } = arg[0];
    const userDocument = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId });
    const { _id } = userDocument;

    const driverManagement = await client
      .db('generalData')
      .collection('driverManagement')
      .findOne({ userId }, { session });

    const previousRequests = await client
      .db('generalData')
      .collection('paymentRequests')
      .find({ merchantId: _id.toString(), validated: false }, { session })
      .toArray();
    if (previousRequests.length === 10) {
      throw new Error('Only 10 requests are allowed at a time');
    }
    const totalRequestAmount = previousRequests?.reduce((accu, request) => {
      return add(request.amount, accu);
    }, 0);
    console.log(
      '🚀 ~ file: createPaymentRequest.js:26 ~ totalRequestAmount ~ totalRequestAmount',
      totalRequestAmount
    );
    const paymentRequestAmount = amount;
    const driverManagementBalance = driverManagement.balance;
    const driverManagementUsedBalance = driverManagement.usedBalance;
    const availableBalance = driverManagementBalance - driverManagementUsedBalance;
    console.log(
      '🚀 ~ file: createPaymentRequest.js:21 ~ mainFunction ~ availableBalance',
      availableBalance
    );
    console.log(
      '🚀 ~ file: createPaymentRequest.js:21 ~ mainFunction ~ availableBalance',
      availableBalance - totalRequestAmount
    );

    if (smaller(availableBalance - totalRequestAmount, paymentRequestAmount)) {
      throw new Error('available balance is not enough');
    }

    await client
      .db('generalData')
      .collection('paymentRequests')
      .insertOne(
        {
          merchantId: _id.toString(),
          customerId: adminName,
          amount: parseFloat(amount),
          validated: false,
        },

        { session }
      );
  };
  return await mainWrapperWithSession({ event, mainFunction });
};
