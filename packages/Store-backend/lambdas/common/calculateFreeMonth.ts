interface CalculateFreeMonthProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { addMonths } from './addMonths';
import { FREE_Month } from './constants';

export function calculateFreeMonth({ storeDoc }: { storeDoc: any }) {
  // const today = new Date();
  // today.setHours(today.getHours() + 2);
  // console.log(today, 'shshsh');
  // const openningDay = new Date(2022, 10, 20);
  // console.log(openningDay, 'shshsh');
  // let subscriptionInfo;
  // //   if (today < openningDay) {
  // //     subscriptionInfo = {
  // //       timeOfPayment: today,
  // //       numberOfMonths: 1,
  // //       expirationDate: new Date(2022, 11, 20),
  // //     };
  // //     console.log(subscriptionInfo, 'shshsh');
  // //   } else {
  // const expire = new Date();
  // expire.setMonth(today.getMonth() + 1);
  // subscriptionInfo = {
  //   timeOfPayment: today,
  //   numberOfMonths: 1,
  //   expirationDate: expire,
  // };
  // console.log(subscriptionInfo, 'shshsh');
  //   }

  const subscriptionInfo = storeDoc.subscriptionInfo
    ? {
        timeOfPayment: storeDoc.subscriptionInfo.timeOfPayment,
        numberOfMonths: storeDoc.subscriptionInfo.numberOfMonths + FREE_Month,
        expirationDate: addMonths(FREE_Month, storeDoc.subscriptionInfo.expirationDate),
      }
    : {
        timeOfPayment: new Date(),
        numberOfMonths: FREE_Month,
        expirationDate: addMonths(FREE_Month),
      };

  return subscriptionInfo;
}
