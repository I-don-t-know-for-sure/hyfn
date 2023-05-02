import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { multiply, smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { subscriptionCost } from 'hyfn-types';

interface UpdateSubscibtionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const updateSubscibtionHandler = async ({ arg, client, userId }: UpdateSubscibtionProps) => {
  const { numberOfMonths } = arg[0];
  const storeDoc = await client.db('generalData').collection('storeInfo').findOne({ userId });
  if (!storeDoc) throw new Error('store not found');

  const balance = storeDoc.balance;
  const price = multiply(numberOfMonths, subscriptionCost);
  if (smaller(balance, price)) throw new Error('balance is not enough');

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
        userId,
      },
      {
        $inc: {
          balance: -price,
        },
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
      { userId },
      {
        $set: {
          city: storeDoc.city,
        },
      },
      {}
    );
  return 'success';
};

export const handler = async (event: any) => {
  return await mainWrapper({ event, mainFunction: updateSubscibtionHandler });
};
