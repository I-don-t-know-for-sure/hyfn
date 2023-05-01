import {
  ORDER_TYPE_DELIVERY,
  baseServiceFee,
  storeAndCustomerServiceFee,
  storeServiceFee,
} from 'hyfn-types';
import { calculateOrderCost } from 'lambdas/common/utils';
import { add, largerEq, multiply, smallerEq } from 'mathjs';
import { ObjectId } from 'mongodb';

export const updateAllOrder = async (arg, client) => {
  const orderCart = arg[0];
  const buyerInfo = arg[1];
  const deliveryDate = buyerInfo.deliveryDate;
  const metchesOrder = orderCart[0];
  const { country, city } = metchesOrder;
  const coordinates: any[] = [];
  if (orderCart?.length !== 1) {
    throw new Error('Can`t have more than 1 stores in an order');
  }

  var storesArray: any[] = [];
  console.log('🚀 ~ file: utils.js ~ line 140 ~ updateAllOrder ~ storesArray', storesArray);
  for (let i = 0; i < orderCart.length; i++) {
    const store = orderCart[i];
    const storeDoc = await client
      .db('generalData')
      .collection('storeInfo')
      .findOne({ _id: new ObjectId(store._id) }, {});
    if (storeDoc.city !== city || storeDoc.country !== country) {
      throw new Error('location do not match');
    }
    // const currency = storeDoc.currency
    if (store.country !== country && store.city !== city) {
      throw new Error('can not order from different cities or countries ');
    }
    if (store.orderType === ORDER_TYPE_DELIVERY) {
      coordinates.push(storeDoc.coords.coordinates);
    }
    // if (store.orderType === 'Pickup') {
    //   continue;
    // }
    var addedProductsDocs: any[] = [];
    if (storeDoc.subscriptionInfo.expirationDate < new Date()) {
      console.log(
        '🚀 ~ file: utils.js:152 ~ updateAllOrder ~ subscriptionInfo',
        storeDoc.subscriptionInfo
      );
      throw new Error('expired subscription');
    }
    console.log(storeDoc, 'ddd');
    for (let x = 0; x < store.addedProducts.length; x++) {
      console.log(addedProductsDocs);
      const product = store.addedProducts[x];
      console.log('🚀 ~ file: utils.js:171 ~ updateAllOrder ~ product:', product);
      const productDoc = await client
        .db('base')
        .collection('products')
        .findOne({ _id: new ObjectId(product._id) }, {});
      let validOptions = { hasOptions: false };
      if (Array.isArray(product.options)) {
        validOptions = product.options.map((option) => {
          const validOption = productDoc.options.options.find(
            (realOption) => realOption.key === option.key
          );
          // if (option.optionValues.length === 0) {
          //   throw new Error('option does not have values');
          // }
          if (option.optionValues.length > validOption.maximumNumberOfOptionsForUserToSelect) {
            throw new Error('option does not meet option conditions');
          }
          if (validOption.isRequired) {
            if (
              option.optionValues.length > validOption.minimumNumberOfOptionsForUserToSelect ||
              option.optionValues.length < validOption.minimumNumberOfOptionsForUserToSelect
            ) {
              throw new Error('option does not meet option conditions');
            }
          }
          const validValues = option.optionValues.map((customerValue) => {
            return validOption.optionValues.find(
              (validValue) => validValue.key === customerValue.key
            );
          });
          return { ...option, optionValues: validValues };
        });
      }
      addedProductsDocs.push({
        ...productDoc,
        key: new ObjectId().toString(),
        options: validOptions,
        qty: product.qty,
        instructions: product?.instructions,
      });
    }
    storesArray.push({
      ...storeDoc,
      pickupConfirmation: new ObjectId().toString(),
      addedProducts: addedProductsDocs,
      orderType: storeDoc.storeType.includes('Restaurant') ? store.orderType : 'Delivery',
      orderStatus: 'pending',
    });
  }
  const orderCost = calculateOrderCost(storesArray);
  console.log('🚀 ~ file: utils.js:195 ~ updateAllOrder ~ orderCost', orderCost);
  if (orderCost < 50) {
    throw new Error('can not create order with less than 50');
  }
  console.log(coordinates.length);
  console.log(orderCart[0].orderType);
  const allStoresDurations = storesArray.reduce((accu, store) => {
    const storeTotalDuration = store.addedProducts.reduce((accu, product) => {
      return accu + 1;
    }, 0);
    return accu + storeTotalDuration;
  }, 0);
  const storePickupFee = (() => {
    const fee = multiply(allStoresDurations, 0.25);
    if (largerEq(fee, 5)) {
      return 5;
    }
    if (smallerEq(fee, 1)) {
      return 1;
    }
    return fee;
  })();
  if (coordinates.length > 0 && orderCart[0].orderType === ORDER_TYPE_DELIVERY) {
    const deliveryUrl = coordinates.reduce(
      (accum, point) => `${accum};${point[0]},${point[1]}`,
      `${buyerInfo.customerCoords[1]},${buyerInfo.customerCoords[0]}`
    );

    console.log(deliveryUrl);

    const orderCostAfterFee = orderCost - orderCost * storeServiceFee;

    const serviceFee = add(baseServiceFee, multiply(orderCost, storeAndCustomerServiceFee));

    const totalCost = add(orderCostAfterFee, serviceFee);
    console.log(orderCost, JSON.stringify(storesArray));
    await client
      .db('generalData')
      .collection(`customerInfo`)
      .updateOne(
        { _id: new ObjectId(buyerInfo.customerId) },
        {
          $set: {
            order: {
              orders: storesArray,
              // deliveryDetails: {
              orderType: orderCart[0].orderType,
              buyerCoords: [buyerInfo.customerCoords[1], buyerInfo.customerCoords[0]],
              buyerAddress: buyerInfo.customerAddress,
              drivingDuration: 0,
              storeServiceFee: storePickupFee,
              duration: 0,
              distance: 0,
              deliveryFee: 0,
              serviceFee: serviceFee,
              totalCost: totalCost,
              orderCost: orderCostAfterFee,
              originalDeliveryFee: 0,
              coords: {
                type: 'MultiPoint',
                coordinates: [...coordinates],
                // },
              },
              deliveryDate,
            },
          },
        },
        {}
      );
  } else {
    // order cost after our fee
    const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
    // our service fee

    const serviceFee = add(baseServiceFee, multiply(orderCost, storeAndCustomerServiceFee));
    // total cost of the order
    const totalCost = add(orderCostAfterFee, serviceFee);
    await client
      .db('generalData')
      .collection(`customerInfo`)
      .updateOne(
        { _id: new ObjectId(buyerInfo.customerId) },
        {
          $set: {
            order: {
              orders: storesArray,
              /////
              coords: {
                type: 'MultiPoint',
                coordinates: [[buyerInfo.customerCoords[1], buyerInfo.customerCoords[0]]],
              },
              orderType: orderCart[0].orderType,
              buyerCoords: [buyerInfo.customerCoords[1], buyerInfo.customerCoords[0]],
              buyerAddress: buyerInfo.customerAddress,
              serviceFee: serviceFee,
              storeServiceFee: storePickupFee,
              duration: 0,
              distance: 0,
              deliveryFee: 0,
              orderCost: parseFloat(orderCostAfterFee.toFixed(3)),
              totalCost: totalCost,
              deliveryDate,
            },
          },
        },
        {}
      );

    return;
  }
};
