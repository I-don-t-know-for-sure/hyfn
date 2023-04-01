interface PayStoreProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
'use strict';

import { ObjectId } from 'mongodb';

import { storeAndCustomerServiceFee } from 'hyfn-types';
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }: MainFunctionProps) => {
    var result;

    const { driverId, storeId, country } = arg[0];

    console.log(arg);
    // await argValidations(arg);

    const driverDoc = await client
      .db('generalData')
      .collection('driverData')
      .findOne(
        {
          _id: new ObjectId(driverId),
        },
        { session }
      );

    const storeVerificationObject = driverDoc?.storeVerifications?.find((store) => {
      return store.storeId === storeId;
    });

    if (!storeVerificationObject) {
      throw new Error('Store must verify your identity');
    }

    const orderId = driverDoc.orderId;
    console.log(driverDoc, driverId, 'hhhhhhh');
    const orderDoc = await client
      .db('base')
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) }, { session });

    if (!orderDoc.serviceFeePaid) {
      throw new Error('service fee was not paid yet');
    }
    console.log(orderDoc, 'aaaa');

    const storeOrder = orderDoc.orders.find((store) => store._id?.toString() === storeId);

    if (storeOrder === null || storeOrder === undefined) {
      throw new Error(' storeOrder not found at 43');
    }
    const productNotPicked = storeOrder.addedProducts.find(
      (product) => product?.pickup?.pickedUp === undefined
    );
    if (productNotPicked) {
      throw new Error('one of the products not picked');
    }
    // if the order was canceled then we won't allow the driver to ask for payment

    if (storeOrder.canceled) {
      throw new Error('store was canceled');
    }

    if (storeOrder?.readyForPayment?.ready) {
      throw new Error('already done');
    }
    // var originalCost = 0;
    // const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
    //   console.log(product, 'hhdhdhdhdh');
    //   if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
    //     throw new Error('one of the products was not picked');
    //   originalCost = originalCost + product.pricing.price * product?.qty;

    //   return accu + product.pricing.price * product?.pickup.QTYFound;
    // }, 0);
    // const amountToReturnToCustomer = originalCost - amountToPay;
    // const {amountToPay,amountToReturnToCustomer,originalCost} = calculateAmountToPayTheStoreAndAmountToReturnTheCustomer(storeOrder)
    // console.log(amountToReturnToCustomer, amountToPay, originalCost, storeId);
    // await client
    //   .db('generalData')
    //   .collection('storeInfo')
    //   .updateOne(
    //     { _id: new ObjectId(storeId) },
    //     {
    //       $inc: { balance: +amountToPay },
    //     },
    //     { session }
    //   );

    await client
      .db('base')
      .collection('orders')
      .updateOne(
        {
          '_id': new ObjectId(orderId),
          'orders._id': new ObjectId(storeId),
          'status._id': new ObjectId(storeId),
        },
        {
          $set: {
            'orders.$.readyForPayment': {
              ready: true,
              date: new Date(),
            },
          },
        },
        { session }
      );

    return result;
  };
  return await mainWrapper({
    mainFunction,

    event,
  });

  // Ensures that the client will close when you finish/error

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
function calculateAmountToPayTheStoreAndAmountToReturnTheCustomer(storeOrder) {
  var originalCostAfterFee = 0;

  const amountToPay = storeOrder.addedProducts.reduce((accu, product) => {
    console.log(product, 'hhdhdhdhdh');
    if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
      throw new Error('one of the products was not picked');
    const serviceFee = product.pricing.price * product?.qty * storeAndCustomerServiceFee;
    originalCostAfterFee = originalCostAfterFee + product.pricing.price * product?.qty - serviceFee;
    const amountToPayServiceFee =
      product.pricing.price * product?.pickup.QTYFound * storeAndCustomerServiceFee;

    return accu + product.pricing.price * product?.pickup.QTYFound - amountToPayServiceFee;
  }, 0);
  const amountToReturnToCustomer = originalCostAfterFee - amountToPay;
  return { amountToReturnToCustomer, amountToPay, originalCost: originalCostAfterFee };
}
