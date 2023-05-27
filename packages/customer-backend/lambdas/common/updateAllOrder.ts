import { MainFunctionProps } from 'hyfn-server';
import {
  ORDER_TYPE_DELIVERY,
  baseServiceFee,
  storeAndCustomerServiceFee,
  storeServiceFee,
} from 'hyfn-types';
import { calculateOrderCost } from 'lambdas/common/utils';
import { add, largerEq, multiply, smallerEq } from 'mathjs';
import { MongoClient, ObjectId } from 'mongodb';

export const updateAllOrder = async ({
  arg,
  client,
  customerDoc,
  db,
}: {
  arg: any;
  client: MongoClient;
  customerDoc: any;
  db: MainFunctionProps['db'];
}) => {
  await db.transaction().execute(async (trx) => {
    const orderCart = arg[0];
    const buyerInfo = arg[1];
    const deliveryDate = buyerInfo.deliveryDate;
    const metchesOrder = orderCart[0];
    const { country, city } = metchesOrder;
    const coordinates: any[] = [];
    var storeId = '';
    if (orderCart?.length !== 1) {
      throw new Error('Can`t have more than 1 stores in an order');
    }

    var storesArray: any[] = [];
    console.log('🚀 ~ file: utils.js ~ line 140 ~ updateAllOrder ~ storesArray', storesArray);
    for (let i = 0; i < orderCart.length; i++) {
      const store = orderCart[i];

      const storeDoc = await trx
        .selectFrom('stores')
        .selectAll()
        .where('id', '=', store.id)
        .executeTakeFirstOrThrow();
      storeId = storeDoc.id;
      // if (storeDoc.city !== city || storeDoc.country !== country) {
      //   throw new Error('location do not match');
      // }
      // // const currency = storeDoc.currency
      // if (store.country !== country && store.city !== city) {
      //   throw new Error('can not order from different cities or countries ');
      // }

      // if (store.orderType === 'Pickup') {
      //   continue;
      // }
      var addedProductsDocs: any[] = [];
      if (storeDoc.expirationDate < new Date()) {
        throw new Error('expired subscription');
      }
      console.log(storeDoc, 'ddd');
      for (let x = 0; x < store.addedProducts.length; x++) {
        console.log(addedProductsDocs);
        const product = store.addedProducts[x];
        console.log('🚀 ~ file: utils.js:171 ~ updateAllOrder ~ product:', product);

        const productDoc = await trx
          .selectFrom('products')
          .selectAll()
          .where('id', '=', product.id)
          .executeTakeFirstOrThrow();
        let validOptions = [];
        if (Array.isArray(product.options)) {
          validOptions = product.options.map((option) => {
            const validOption = productDoc.options.find(
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
        orderType: storeDoc.storeType.includes('restaurant') ? store.orderType : 'Delivery',
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

    const deliveryUrl = coordinates.reduce(
      (accum, point) => `${accum};${point[0]},${point[1]}`,
      `${buyerInfo.customerCoords[1]},${buyerInfo.customerCoords[0]}`
    );

    console.log(deliveryUrl);

    const orderCostAfterFee = orderCost - orderCost * storeServiceFee;

    const serviceFee = add(baseServiceFee, multiply(orderCost, storeAndCustomerServiceFee));

    const totalCost = add(orderCostAfterFee, serviceFee);
    console.log({
      orderType: orderCart[0].orderType,
      customerAddress: buyerInfo.customerAddress,
      storeServiceFee: parseFloat(storePickupFee as any),
      serviceFeePaid: customerDoc.subscribedToHyfnPlus ? true : false,
      orderCost: parseFloat(orderCostAfterFee as any),
      deliveryDate,
      customerLat: parseFloat(buyerInfo.customerCoords[0]),
      customerLong: parseFloat(buyerInfo.customerCoords[1]),
      totalCost: parseFloat(totalCost as any),
      serviceFee: parseFloat(serviceFee as any),
      storeStatus: ['pending'],
      customerStatus: ['initial'],
      customerId: customerDoc.id,
      storeId: storeId,

      ...(orderCart[0].orderType === 'Delivery'
        ? { driverStatus: ['initial'], proposals: [], proposalsIds: [], deliveryFeePaid: false }
        : {}),
    });
    const order = await trx
      .insertInto('orders')
      .values({
        orderType: orderCart[0].orderType,
        customerAddress: buyerInfo.customerAddress,
        storeServiceFee: parseFloat(storePickupFee as any),
        serviceFeePaid: customerDoc.subscribedToHyfnPlus ? true : false,
        orderCost: parseFloat(orderCostAfterFee as any),
        deliveryDate,
        customerLat: parseFloat(buyerInfo.customerCoords[0]),
        customerLong: parseFloat(buyerInfo.customerCoords[1]),
        totalCost: parseFloat(totalCost as any),
        serviceFee: parseFloat(serviceFee as any),
        orderStatus: ['active'],
        storeStatus: ['pending'],
        customerStatus: ['initial'],
        customerId: customerDoc.id,
        storeId: storeId,
        deliveryFee: 0,
        reportsIds: [],

        ...(orderCart[0].orderType === 'Delivery'
          ? { driverStatus: ['initial'], proposals: [], proposalsIds: [], deliveryFeePaid: false }
          : { driverStatus: [], proposals: [], proposalsIds: [] }),
      })
      .returning('id')
      .executeTakeFirst();

    await trx
      .insertInto('orderProducts')
      .values(
        addedProductsDocs.map((product) => ({
          title: product.title,
          // description: product.description,
          options: product.options || [],
          hasOptions: product.hasOptions || false,
          price: parseFloat(product.price),
          prevPrice: parseFloat(product.prevPrice),
          images: product.images,
          qty: parseInt(product.qty),
          instructions: product.instructions,
          storeId: storeId,
          orderId: order.id,
          pickupStatus: ['initial'],
          qtyFound: 0,
        }))
      )
      .execute();
  });
  return 'seccess';
};
