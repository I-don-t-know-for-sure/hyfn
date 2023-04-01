interface UtilsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import axios from 'axios';
import { randomUUID } from 'crypto';
import { add, largerEq, multiply, smaller, smallerEq, subtract } from 'mathjs';
import { ObjectId } from 'mongodb';

import {
  ORDER_TYPE_DELIVERY,
  deliveryServiceFee,
  storeAndCustomerServiceFee,
  storeServiceFee,
} from './constants';

export const updateRating = (
  oldCurrentRatingTotal = 0,
  oldRatingCount = 0,
  newRating,
  oldRating = 0
) => {
  const newCurrentRatigTotal = oldCurrentRatingTotal + newRating - oldRating;
  const newRatingCount = oldRatingCount;

  const newCurrentRating = newCurrentRatigTotal / newRatingCount;

  return {
    currentRating: newCurrentRating.toFixed(1),
    currentRatingTotal: newCurrentRatigTotal,
    ratingCount: newRatingCount,
  };
};

export const addRating = (oldCurrentRatingTotal = 0, oldRatingCount = 0, newRating) => {
  const newCurrentRatigTotal = oldCurrentRatingTotal + newRating;
  const newRatingCount = oldRatingCount + 1;

  const newCurrentRating = newCurrentRatigTotal / newRatingCount;
  return {
    currentRating: newCurrentRating.toFixed(1),
    currentRatingTotal: newCurrentRatigTotal,
    ratingCount: newRatingCount,
  };
};

export const rateDriver = async ({
  newRating,
  customerId,
  driverId,
  orderId,
  country,
  session,
  client,
}) => {
  var result;

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        _id: new ObjectId(orderId),
      },
      {
        $set: {
          driverRating: newRating,
        },
      },
      { session }
    );

  await client
    .db('generalData')
    .collection('driverInfo')
    .updateOne(
      {
        _id: new ObjectId(driverId),
      },
      {
        $push: {
          ratings: { customerId, rating: newRating },
        },
      },
      { session, upsert: true }
    );

  const { currentRatingTotal: oldCurrentRatingTotal = 0, ratingCount: oldRatingCount = 0 } =
    await client
      .db('generalData')
      .collection('driverData')
      .findOne({ _id: new ObjectId(driverId) }, { session });

  const { currentRating, currentRatingTotal, ratingCount } = addRating(
    oldCurrentRatingTotal,
    oldRatingCount,
    newRating
  );

  await client
    .db('generalData')
    .collection('driverData')
    .updateOne(
      {
        _id: new ObjectId(driverId),
      },
      {
        $set: {
          currentRating,
          currentRatingTotal,
          ratingCount,
        },
      },
      { session }
    );
  result = 'rating successful';
};

export const getStore = async (store, client) => {
  const storeDoc = await client
    .db('generalData')
    .collection('storeInfo')
    .findOne({ _id: new ObjectId(store._id) });
  return { ...storeDoc };
};

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
  // for (let i = 0; i < orderCart?.length; i++) {
  //   const store = orderCart[i];

  //   if (store.country !== country && store.city !== city) {
  //     throw new Error('can not order from different cities or countries ');
  //   }
  //   if (store.orderType === 'Pickup') {
  //     continue;
  //   }
  //   coordinates.push(store.coords.coordinates);
  // }

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
    // return { orderCart, buyerInfo, orders, deliveryUrl };

    // const deliveryDetails = await axios({
    //   method: 'get',
    //   url: `https://api.mapbox.com/directions/v5/mapbox/driving/${deliveryUrl}?annotations=maxspeed&overview=full&geometries=geojson&access_token=pk.eyJ1IjoiYmFyaW9teW1lbiIsImEiOiJjbDFrcXRnaHowM2lxM2Jtb3h3Z2J4bDQ0In0.DKfCj0bt3QfE9QgacrWnpA`,
    // });
    console.log(deliveryUrl);
    // const deliveryFee = deliveryDetails.data.routes[0].distance * 0.0001

    // const durationInMinutes = allStoresDurations + deliveryDetails.data.routes[0].duration / 60;

    // const deliveryFee =
    //   (durationInMinutes / 60) * 30 < 5 ? 5 : Math.ceil((durationInMinutes / 60) * 30);

    // const orderCost = calculateOrderCost(storesArray);
    // order cost after our fee
    const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
    // our service fee
    const serviceFee = orderCost * storeAndCustomerServiceFee;
    // delivery fee after our fee
    // const deliveryFeeAfterFee = Math.ceil(deliveryFee - deliveryFee * deliveryServiceFee);
    // total cost of the order
    const totalCost = orderCostAfterFee + serviceFee;
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
              serviceFee: parseFloat(serviceFee.toFixed(3)),
              totalCost: parseFloat(totalCost.toFixed(3)),
              orderCost: parseFloat(orderCostAfterFee.toFixed(3)),
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
    // const orderCost = storesArray.reduce((accu, store) => {
    //   const storeTotal = store.addedProducts?.reduce(
    //     (acc, product) => acc + product.pricing.price * product.qty,
    //     0
    //   );

    //   return accu + storeTotal;
    // }, 0);

    // const orderCost = calculateOrderCost(storesArray);
    // order cost after our fee
    const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
    // our service fee
    const serviceFee = orderCost * storeAndCustomerServiceFee;
    // total cost of the order
    const totalCost = orderCostAfterFee + serviceFee;

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
              serviceFee: parseFloat(serviceFee.toFixed(3)),
              storeServiceFee: storePickupFee,
              duration: 0,
              distance: 0,
              deliveryFee: 0,
              orderCost: parseFloat(orderCostAfterFee.toFixed(3)),

              totalCost: parseFloat(totalCost.toFixed(3)),
              deliveryDate,
            },
          },
        },
        {}
      );
    //     await client.db('generalData').collection(`customerInfo`).updateOne( { _id: new ObjectId(buyerInfo.customerId) },
    //  {
    //         $set: {
    //           order: {
    //             orders: storesArray,

    //             deliveryDetails: {
    //               /////
    //               geometery: {
    //                 type: 'MultiPoint',
    //                 coordinates: [[buyerInfo.customerCoords[1], buyerInfo.customerCoords[0]]],
    //               },
    //               orderType: orderCart[0].orderType,
    //               buyerCoords: [buyerInfo.customerCoords[1], buyerInfo.customerCoords[0]],
    //               buyerAddress: buyerInfo.customerAddress,
    //               serviceFee: parseFloat(serviceFee.toFixed(3)),
    //               duration: 0,
    //               distance: 0,
    //               deliveryFee: 0,
    //               orderCost: parseFloat(orderCostAfterFee.toFixed(3)),

    //               totalCost: parseFloat(totalCost.toFixed(3)),
    //             },
    //           },
    //         },
    //       },
    //  {},

    //     );
    return;
  }
};

export const updateOrderProducts = async (arg, client) => {
  console.log('🚀 ~ file: utils.js ~ line 277 ~ updateOrderProducts ~ arg', arg);
  const orderCart = arg[0];

  const customerInfo = arg[1];

  const metchesOrder = orderCart[0];
  const { country, city } = metchesOrder;

  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne(
      {
        _id: new ObjectId(customerInfo.customerId),
      },
      {}
    );
  console.log(customerDoc, customerInfo, 'orderProducts');
  const orders = customerDoc.order.orders;
  // for(let i = 0; i < orderCart)
  const newOrder: any[] = [];
  for (let i = 0; i < orderCart?.length; i++) {
    const newStoreAddedProducts: any[] = [];
    const store = orderCart[i];
    if (store._id !== orders[i]._id) {
      return 'should update all order';
    }

    console.log(JSON.stringify(orderCart));
    for (let x = 0; x < orderCart[i]?.addedProducts?.length; x++) {
      if (
        orderCart[i].addedProducts[x]._id !== orders[i]?.addedProducts[x]?._id ||
        !orders[i]?.addedProducts[x]?._id
      ) {
        const productToBeAdded = store.addedProducts[x];
        const newProduct = await client
          .db('base')
          .collection('products')
          .findOne(
            {
              _id: new ObjectId(productToBeAdded._id),
            },
            {}
          );
        if (!newProduct) throw 'product does not exist';
        if (newProduct?.country !== productToBeAdded?.country) throw 'product invalid or something';

        newStoreAddedProducts.push({
          ...newProduct,
          qty: productToBeAdded.qty,
        });
      } else {
        newStoreAddedProducts.push({
          ...store.addedProducts[x],
        });
      }
    }

    newOrder.push({
      ...orderCart[i],
      addedProducts: newStoreAddedProducts,
    });
  }
  console.log(newOrder);
  const orderCost = newOrder.reduce((accu, store) => {
    const storeTotal = store.addedProducts?.reduce(
      (acc, product) => acc + product.pricing.price * product.qty,
      0
    );

    return accu + storeTotal;
  }, 0);
  const deliveryFee = customerDoc?.order?.deliveryDetails?.deliveryFee;

  // order cost after our fee
  const orderCostAfterFee = orderCost - orderCost * storeServiceFee;
  // delivery fee after our fee
  const deliveryFeeAfterFee = deliveryFee - deliveryFee * deliveryServiceFee;
  // our service fee
  const serviceFee = orderCost * storeAndCustomerServiceFee + deliveryFee * deliveryServiceFee;
  // total cost of the order
  const totalCost = orderCostAfterFee + serviceFee + deliveryFeeAfterFee;

  await client
    .db('generalData')
    .collection(`customerInfo`)
    .updateOne(
      { _id: new ObjectId(customerInfo.customerId) },
      {
        $set: {
          order: {
            deliveryDetails: {
              ...customerDoc?.order.deliveryDetails,
              orderCost: orderCostAfterFee,
            },
            orders: newOrder,
            serviceFee,
            totalCost,
          },
        },
      },
      {}
    );
};

export const getCountryInfo = () => {
  const countries = ['Libya'];
  const cities = [
    'Tripoli',
    'Ajdabiya',
    'Zuwara',
    'Yafran',
    'Nalut',
    'Gharyan',
    'Al Bayda',
    'Bani Walid',
    'Al-Marj',
    'Mizda',
    'Benghazi',
    'Awbari',
    'Tobruk',
    'Al-Khums',
    'Murzuk',
    'Shahat',
    'Sabratah',
    'Ghat',
    'Sirte',
    'Tajura',
    'Misrata',
    'Zawiya',
    'Sabha',
    'Brak',
    'Ghadamis',
    'Al Abyar',
    'Tarhunah',
    'Derna',
    'Waddan',
    'Awjila',
    'Suluq',
    'Zelten',
    'Qatrun',
    'Al Qubbah',
    'Tocra',
    'Jalu',
    'Zliten',
    'Al Jamīl',
    'Brega',
    'Farzougha',
    'Sorman',
    'Msallata',
    'Kikla',
  ];
  return { countries, cities };
};

export const getCountryInfoRightOne = () => {
  return [
    {
      country: 'Libya',
      cities: [
        'Tripoli',
        'Ajdabiya',
        'Zuwara',
        'Yafran',
        'Nalut',
        'Gharyan',
        'Al Bayda',
        'Bani Walid',
        'Al-Marj',
        'Mizda',
        'Benghazi',
        'Awbari',
        'Tobruk',
        'Al-Khums',
        'Murzuk',
        'Shahat',
        'Sabratah',
        'Ghat',
        'Sirte',
        'Tajura',
        'Misrata',
        'Zawiya',
        'Sabha',
        'Brak',
        'Ghadamis',
        'Al Abyar',
        'Tarhunah',
        'Derna',
        'Waddan',
        'Awjila',
        'Suluq',
        'Zelten',
        'Qatrun',
        'Al Qubbah',
        'Tocra',
        'Jalu',
        'Zliten',
        'Al Jamīl',
        'Brega',
        'Farzougha',
        'Sorman',
        'Msallata',
        'Kikla',
      ],
    },
  ];
};
function calculateOrderCost(storesArray) {
  return storesArray.reduce((accu, store, currentIndex) => {
    const storeTotal = store.addedProducts?.reduce((acc, product) => {
      const productValuesPrice = calculateProductOptionsValue(product);
      console.log(
        '🚀 ~ file: utils.js:559 ~ productValuesPrice=product.options.reduce ~ productValuesPrice',
        productValuesPrice
      );

      const productTotalPrice = add(product.pricing.price, productValuesPrice);
      console.log('hcbdhcbdhbcdhcdbhdbchbdhb', productTotalPrice * product.qty);
      return add(acc, multiply(productTotalPrice, product.qty));
    }, 0);
    storesArray[currentIndex] = {
      ...storesArray[currentIndex],
      orderCost: subtract(storeTotal, multiply(storeTotal, storeServiceFee)),
    };

    console.log(
      '🚀 ~ file: utils.js:559 ~ productValuesPrice=product.options.reduce ~ productValuesPrice',
      subtract(storeTotal, multiply(storeTotal, storeServiceFee))
    );
    // storesArray.map((oldStore) => {
    //   if (oldStore._id === store._id) {
    //     return { ...oldStore, orderCost: storeTotal - storeTotal * storeServiceFee };
    //   }
    //   return oldStore;
    // });
    return add(accu, storeTotal);
  }, 0);
}
export function calculateProductOptionsValue(product) {
  let productValuesPrice = 0;
  if (Array.isArray(product.options)) {
    productValuesPrice = product.options.reduce((accu, option) => {
      const optionValuesPrice = option.optionValues.reduce((valueAccu, value) => {
        return add(valueAccu, value.price);
      }, 0);
      return add(accu, optionValuesPrice);
    }, 0);
  }
  return productValuesPrice;
}
