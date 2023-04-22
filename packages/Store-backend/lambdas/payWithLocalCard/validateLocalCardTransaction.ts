interface ValidateLocalCardTransactionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
import { ObjectId } from 'mongodb';
import {
  adminName,
  TRANSACTION_TYPE_WALLET,
  TRANSACTION_TYPE_SUBSCRIPTION,
  subscriptionCost,
} from '../resources';
import { getAdminLocalCardCreds } from '../common/getAdminLocalCardCreds';
import {
  isLocalCardTransactionValidated,
  MainFunctionProps,
  mainWrapperWithSession,
} from 'hyfn-server';
const validateLocalCardTransaction = async ({ arg, client, session }: MainFunctionProps) => {
  const { transactionId } = arg[0];
  // const dataServicesURL = process.env.moalmlatDataService;
  const transaction = await client
    .db('generalData')
    .collection('transactions')
    .findOne({ _id: new ObjectId(transactionId) }, { session });
  console.log('any');
  if (transaction.validated) {
    return 'transaction already approved';
  }
  console.log('log here');
  if (transaction.storeId === adminName) {
    var { MerchantId, TerminalId, secretKey } = getAdminLocalCardCreds();
  }
  console.log('shsh');
  const isValidated = await isLocalCardTransactionValidated({
    MerchantId,
    secretKey,
    TerminalId,
    transactionId,
    includeLocalCardTransactionFeeToPrice: true,
    amount: transaction.amount,
  });
  if (isValidated) {
    await client
      .db('generalData')
      .collection('transactions')
      .updateOne(
        { _id: new ObjectId(transaction._id) },
        {
          $set: {
            validated: isValidated,
          },
        },
        { session }
      );
  }
  console.log('herehh');
  if (isValidated) {
    if (transaction.transactionType === TRANSACTION_TYPE_WALLET) {
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          {
            _id: new ObjectId(transaction.customerId),
          },
          {
            $inc: { balance: Math.abs(parseFloat(transaction.amount.toFixed(3))) },
          },
          {}
        );
      return 'transaction approved';
    }
    if (transaction.transactionType === TRANSACTION_TYPE_SUBSCRIPTION) {
      const storeDoc = await client
        .db('generalData')
        .collection('storeInfo')
        .findOne({ _id: new ObjectId(transaction.customerId) }, { session });
      const numberOfMonths = transaction.amount / subscriptionCost;
      const addMonths = (monthsToAdd = 1, currentDate = new Date()) => {
        const currentMonth = currentDate.getMonth();
        if (monthsToAdd + currentMonth >= 12) {
          const newMonth = monthsToAdd + currentMonth - 12;
          currentDate.setFullYear(currentDate.getFullYear() + 1, newMonth);
          console.log(currentDate);
        } else {
          const newMonth = monthsToAdd + currentMonth;
          currentDate.setMonth(newMonth);
          return currentDate;
        }
      };
      const subscriptionInfo = storeDoc.subscriptionInfo
        ? {
            timeOfPayment: storeDoc.subscriptionInfo.timeOfPayment,
            numberOfMonths: storeDoc.subscriptionInfo.numberOfMonths + numberOfMonths,
            expirationDate: addMonths(numberOfMonths, storeDoc.subscriptionInfo.expirationDate),
          }
        : {
            timeOfPayment: new Date(),
            numberOfMonths: numberOfMonths,
            expirationDate: addMonths(numberOfMonths),
          };
      // const payment = await axios(config);
      // console.log(payment.data);
      // if (payment.data.statusCode === 927) {
      //   result = payment.data.result;
      //   return;
      // }
      // if (payment.data.statusCode !== 0) {
      //   throw "transaction went wrong";
      // }
      // result = payment.data;
      /*
      add transactionId and other payment info like phone number and maybe time to customerData collection
      */
      await client
        .db('generalData')
        .collection('storeInfo')
        .updateOne(
          {
            _id: new ObjectId(transaction.customerId),
          },
          {
            $set: {
              subscriptionInfo,
              monthlySubscriptionPaid: true,
            },
          },
          {}
        );
      await client
        .db('base')
        .collection('storeFronts')
        .updateOne(
          { _id: new ObjectId(transaction.customerId) },
          {
            $set: {
              city: storeDoc.city,
            },
          },
          {}
        );
    }
    return 'transaction approved';
  }
  return 'transaction not approved yet or not found';
};
export const handler = async (event) => {
  return await mainWrapperWithSession({ event, mainFunction: validateLocalCardTransaction });
};
