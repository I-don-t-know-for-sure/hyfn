import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { multiply, smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { subscriptionCost } from 'hyfn-types';

interface UpdateSubscibtionProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}

export const updateSubscibtionHandler = async ({
  arg,
  client,
  userId,
  db,
}: UpdateSubscibtionProps) => {
  const { numberOfMonths } = arg[0];

  const storeDoc = await db
    .selectFrom('stores')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (!storeDoc) throw new Error('store not found');

  const balance = storeDoc.balance;
  const price = multiply(numberOfMonths, subscriptionCost);
  if (smaller(balance, price)) throw new Error('balance is not enough');

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
  const subscriptionInfo = storeDoc.monthlySubscriptionPaid
    ? {
        timeOfPayment: storeDoc.timeOfPayment,
        numberOfMonths: storeDoc.numberOfMonths + numberOfMonths,
        expirationDate: addMonths(numberOfMonths, storeDoc.expirationDate),
      }
    : {
        timeOfPayment: new Date(),
        numberOfMonths: numberOfMonths,
        expirationDate: addMonths(numberOfMonths),
      };

  await db
    .updateTable('stores')
    .set({
      timeOfPayment: subscriptionInfo.timeOfPayment,
      numberOfMonths: subscriptionInfo.numberOfMonths,
      expirationDate: subscriptionInfo.expirationDate,
    })
    .where('userId', '=', userId)
    .execute();
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
