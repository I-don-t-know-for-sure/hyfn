export const paySubscriptionHandler = async ({ arg, client }: MainFunctionProps) => {
  var result;
  const { storeId, OTP, numberOfMonths /* temporary */ } = arg[0];
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ id: new ObjectId(storeId) }, {});
  // if (!customerDoc.isPaying) {
  //   return returnsObj["no transaction in progress"];
  // }
  const config = {
    method: 'post',
    url: `${process.env.sadadURL}/api/Pay`,
    headers: {
      'Authorization': `Bearer ${process.env.sadadApiKey}`,
      'Content-Type': 'application/json',
    },
    data: {
      OTP: OTP,
      transactionId: storeDoc.transactionId,
    },
    mode: 'no-cors',
  };
  const addMonths = (monthsToAdd = 1, currentDate = new Date()) => {
    const currentMonth = currentDate.getMonth();
    if (monthsToAdd + currentMonth >= 12) {
      const newMonth = monthsToAdd + currentMonth - 12;
      currentDate.setFullYear(currentDate.getFullYear() + 1, newMonth);
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

  await client
    .db('generalData')
    .collection('storeInfo')
    .updateOne(
      {
        id: new ObjectId(storeId),
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
      {
        id: new ObjectId(storeId),
      },
      {
        $set: {
          city: storeDoc.city,
        },
      },
      {}
    );
  return result;
};
interface PaySubscriptionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
('use strict');
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { returnsObj } from 'hyfn-types';
import { ObjectId } from 'mongodb';
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: paySubscriptionHandler,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
