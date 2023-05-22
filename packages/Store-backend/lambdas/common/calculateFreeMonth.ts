import { addMonths } from './addMonths';
import { FREE_Month } from 'hyfn-types';
export function calculateFreeMonth({ storeDoc }: { storeDoc: any }) {
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
