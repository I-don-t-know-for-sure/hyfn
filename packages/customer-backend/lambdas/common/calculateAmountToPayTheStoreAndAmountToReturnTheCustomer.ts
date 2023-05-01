import { add, multiply, subtract } from 'mathjs';
import { ORDER_TYPE_PICKUP, storeAndCustomerServiceFee, storeServiceFee } from 'hyfn-types';
import { calculateProductOptionsValue } from './utils';
export function calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({ storeOrder }) {
  var orderCost = 0;
  const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
    if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
      throw new Error('one of the products was not picked');
    orderCost = add(multiply(product.qty, product.pricing.price), orderCost) as unknown as number;

    const productValuesPrice = calculateProductOptionsValue(product);

    const productTotalPrice = add(product.pricing.price, productValuesPrice);
    return add(multiply(product?.pickup.QTYFound, productTotalPrice), accu);
  }, 0);

  const orderCostAfterFee = subtract(orderCost, multiply(orderCost, storeServiceFee));
  // our service fee
  const serviceFee = multiply(orderCost, storeAndCustomerServiceFee);

  const amountToPayAfterFee = subtract(amountToPay, multiply(amountToPay, storeServiceFee));

  // delivery fee after our fee
  // total cost of the order

  return {
    amountToPay: amountToPayAfterFee,
    originalCost: orderCostAfterFee,
  };
}
