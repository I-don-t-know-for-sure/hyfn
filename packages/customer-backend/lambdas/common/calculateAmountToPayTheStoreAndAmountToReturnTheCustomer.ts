// import { ORDER_TYPE_PICKUP, storeAndCustomerServiceFee, storeServiceFee } from './constants';
// import { calculateProductOptionsValue } from './utils';
// export function calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({ storeOrder }) {
//   var orderCost = 0;
//   const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
//     console.log(product, 'hhdhdhdhdh');
//     if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
//       throw new Error('one of the products was not picked');
//     orderCost = orderCost + product.pricing.price * product.qty;
//     const productValuesPrice = calculateProductOptionsValue(product);
//     console.log(
//       '🚀 ~ file: utils.js:559 ~ productValuesPrice=product.options.reduce ~ productValuesPrice',
//       productValuesPrice
//     );
//     const productTotalPrice = product.pricing.price + productValuesPrice;
//     return accu + productTotalPrice * product?.pickup.QTYFound;
//   }, 0);
//   console.log(
//     '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:14 ~ amountToPay ~ amountToPay',
//     amountToPay
//   );
//   const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
//   // our service fee
//   const serviceFee = orderCost * storeAndCustomerServiceFee;
//   console.log(
//     '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:18 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ serviceFee',
//     serviceFee
//   );
//   console.log(
//     '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:5 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ orderCost',
//     orderCost
//   );
//   const amountToPayAfterFee = amountToPay - amountToPay * storeServiceFee;
//   const amountToPayServiceFee = amountToPay * storeAndCustomerServiceFee;
//   console.log(
//     '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:21 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ amountToPayServiceFee',
//     amountToPayServiceFee
//   );
//   // delivery fee after our fee
//   // total cost of the order
//   const amountToReturnToCustomer = serviceFee - amountToPayServiceFee;
//   return {
//     amountToReturnToCustomer: amountToReturnToCustomer,
//     amountToPay: amountToPayAfterFee,
//     originalCost: orderCostAfterFee,
//   };
// }
import { add, multiply, subtract } from 'mathjs';
import { ORDER_TYPE_PICKUP, storeAndCustomerServiceFee, storeServiceFee } from 'hyfn-types';
import { calculateProductOptionsValue } from './utils';
export function calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({ storeOrder }) {
  var orderCost = 0;
  const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
    console.log(product, 'hhdhdhdhdh');
    if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
      throw new Error('one of the products was not picked');
    orderCost = add(multiply(product.qty, product.pricing.price), orderCost) as unknown as number;
    console.log(
      '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.ts:70 ~ amountToPay ~ orderCost:',
      orderCost
    );
    const productValuesPrice = calculateProductOptionsValue(product);
    console.log(
      '🚀 ~ file: utils.js:559 ~ productValuesPrice=product.options.reduce ~ productValuesPrice',
      productValuesPrice
    );
    const productTotalPrice = add(product.pricing.price, productValuesPrice);
    return add(multiply(product?.pickup.QTYFound, productTotalPrice), accu);
  }, 0);
  console.log(
    '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:14 ~ amountToPay ~ amountToPay',
    amountToPay
  );
  const orderCostAfterFee = subtract(orderCost, multiply(orderCost, storeServiceFee));
  // our service fee
  const serviceFee = multiply(orderCost, storeAndCustomerServiceFee);
  console.log(
    '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:18 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ serviceFee',
    serviceFee
  );
  console.log(
    '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:5 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ orderCost',
    orderCost
  );
  const amountToPayAfterFee = subtract(amountToPay, multiply(amountToPay, storeServiceFee));
  const amountToPayServiceFee = multiply(amountToPay, storeAndCustomerServiceFee);
  console.log(
    '🚀 ~ file: calculateAmountToPayTheStoreAndAmountToReturnTheCustomer.js:21 ~ calculateAmountToPayTheStoreAndAmountToReturnTheCustomer ~ amountToPayServiceFee',
    amountToPayServiceFee
  );
  // delivery fee after our fee
  // total cost of the order
  const amountToReturnToCustomer = subtract(serviceFee, amountToPayServiceFee);
  return {
    amountToReturnToCustomer: amountToReturnToCustomer,
    amountToPay: amountToPayAfterFee,
    originalCost: orderCostAfterFee,
  };
}
