'use strict';

import { ObjectId } from 'mongodb';
import { mainValidateFunction } from '../common/authentication';
import { paymentMethods, tarnsactionStatus } from 'hyfn-types';
import { decryptData } from '../common/decrypt';
import { simpleCrypto } from '../common/encryption';
import { mainWrapperWithSession } from '../common/mainWrapperWithSession';
import { getMongoClientWithIAMRole } from '../common/mongodb';

import { findOne } from '../common/mongoUtils/findOne';
import { updateOne } from '../common/mongoUtils/updateOne';
import axios from 'axios';
import { returnsObj } from 'hyfn-types';
export const handler = async (event) => {
  const mainFunction = async ({ arg, session, client, event }) => {
    var result = 'initial';

    const {
      customerId,

      customerPhone,
      birthYear,
      storeId,
      orderId,
      country,
    } = arg[0];

    // const response = await axios({
    //   url: "https://api.ipify.org?format=json",
    //   method: "get",
    // });
    // console.log(response);
    // return response.data;
    /* 
            implement sadad payment here
            */

    const order = await findOne(
      { id: new ObjectId(orderId) },
      { session },
      client.db('base').collection('order')
    );

    const { readyForPayment } = order.orders[storeId];
    const alreadyPaid = order.orders[storeId].tarnsactionInfo.status === tarnsactionStatus.paid;

    if (alreadyPaid) {
      throw new Error(returnsObj['already paid']);
    }

    if (!readyForPayment) {
      throw new Error('driver didn`t finish shopping for you');
    }

    const products = order.orders[storeId].addedProducts;

    const amountToPay = products.reduce((accu, product) => {
      console.log(product, 'hhdhdhdhdh');
      if (!product.pickup || Object.keys(product.pickup)?.length !== 2)
        throw new Error(returnsObj['one of the products was not picked']);

      return accu + product.pricing.price * product?.pickup.QTYFound;
    }, 0);

    const storeAPIToken = await findOne(
      { id: new ObjectId(storeId) },
      {
        projection: {
          id: 0,
          sadadApiKey: 1,
        },
        session,
      },
      client.db('generalData').collection('storeInfo')
    );

    const invoiceNo = new ObjectId();
    const decryptedToken = await decryptData(storeAPIToken.sadadApiKey);
    console.log('sadadApiKey 86', decryptedToken);
    var data = {
      Msisdn: customerPhone,
      BirthYear: birthYear,
      InvoiceNo: `${invoiceNo.toString()}`,
      amount: amountToPay,
      Category: 20,
    };
    var config = {
      method: 'post',
      url: process.env.sadadURL,
      headers: {
        'Authorization': 'Bearer ' + decryptedToken,
        'Content-Type': 'application/json',
      },
      data: data,
      mode: 'no-cors',
    };

    const customerDoc = await findOne(
      { id: new ObjectId(customerId) },
      { session },
      client.db('generalData').collection('customerInfo')
    );
    if (customerDoc.transaction.isPaying) {
      return (result = 'you have another transaction in progress');
    }
    console.log(customerDoc);
    const res = await axios(config);
    console.log(res.data);
    if (!res.data.statusCode === 0) {
      throw new Error(returnsObj['OTP was not sent']);
    }

    await updateOne({
      query: { id: new ObjectId(customerId) },
      update: {
        $set: {
          transaction: {
            isPaying: true,
            transactionId: res.data.result.transactionId,
            amount: amountToPay,
            invoiceNo: invoiceNo.toString(),
            paymentMethod: paymentMethods.sadad,
          },
        },
      },
      options: { session },
      collection: client.db('generalData').collection('customerInfo'),
    });

    result = res.data;

    return result;
  };
  return await mainWrapperWithSession({
    mainFunction,

    event,
    sessionPrefrences: {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    },
  });
};
