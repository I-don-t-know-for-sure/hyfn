import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { driverSchema, USER_TYPE_DRIVER } from 'hyfn-types';
import { smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

interface CreateProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

export const createProposal = async ({ arg, client, userId }: CreateProposalProps) => {
  const { country, orderId, price } = arg[0];
  const projection = {};

  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId });
  if (driverDoc.onDuty) {
    throw new Error('You are on duty');
  }
  if (!driverDoc) {
    throw new Error('driver doc not found');
  }
  if (driverDoc.reported) {
    throw new Error('You have a reported order');
  }
  console.log(driverDoc, 'hshshshssh');
  if (driverDoc.onDuty) {
    throw new Error('You are on duty');
  }

  if (!driverDoc.verified) {
    throw new Error('you are not verified');
  }
  if (!driverDoc.driverManagement) {
    throw new Error('You are not trusted by a driver management');
  }

  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) });

  if (!orderDoc) {
    throw new Error('order not found');
  }

  if (orderDoc.canceled) {
    throw new Error('Order canceled');
  }
  if (smaller(driverDoc.balance, orderDoc.orderCost)) {
    throw new Error('driver does not have enough balance');
  }

  orderDoc.status.find((status) => {
    if (status.userType === USER_TYPE_DRIVER) {
      if (status._id !== '') {
        throw new Error('Order is taken by driver');
      }
    }
  });

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $push: {
          proposalsIds: driverDoc.driverManagement[0],
          proposals: {
            price,
            driverId: driverDoc._id.toString(),
            managementId: driverDoc.driverManagement[0],
          },
        },
      }
    );
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: createProposal });
};
