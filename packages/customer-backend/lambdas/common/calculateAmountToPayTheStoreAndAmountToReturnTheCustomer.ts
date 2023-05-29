import { add, multiply, subtract } from 'mathjs';
import { ORDER_TYPE_PICKUP, storeAndCustomerServiceFee, storeServiceFee } from 'hyfn-types';
import { calculateProductOptionsValue } from './utils';
import { returnsObj } from 'hyfn-types';
export function calculateAmountToPayTheStoreAndAmountToReturnTheCustomer({ storeOrder }) {
  var orderCost = 0;
  const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
    if (product.pickupStatus[product.pickupStatus.length - 1] === 'initial')
      throw new Error(returnsObj['one of the products was not picked']);
    orderCost = add(multiply(product.qty, product.price), orderCost) as unknown as number;

    const productValuesPrice = calculateProductOptionsValue(product);

    const productTotalPrice = add(product.price, productValuesPrice);
    return add(multiply(product?.qtyFound, productTotalPrice), accu);
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
