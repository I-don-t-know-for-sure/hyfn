export const paySubscriptionHandler = async ({ arg, client }) => {
  var result;
  const { storeId, OTP, numberOfMonths /* temporary */ } = arg[0];
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(storeId) }, {});
  // if (!customerDoc.isPaying) {
  //   return "no transaction in progress";
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
        _id: new ObjectId(storeId),
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
        _id: new ObjectId(storeId),
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
