interface UpdateProposalProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { driverSchema, orderSchema } from 'hyfn-types';
import { smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

interface UpdateProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

const updateProposal = async ({ arg, client, userId }: UpdateProposalProps) => {
  const { country, orderId, price } = arg[0];

  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne({ driverId: userId });
  if (!driverDoc) {
    throw new Error('driver not found');
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
  if (orderDoc.acceptedProposal) {
    throw new Error('customer already accepted a proposal');
  }
  if (smaller(driverDoc.balance, orderDoc.orderCost)) {
    throw new Error('driver does not have enough balance');
  }

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          ['proposals.$[proposal]']: {
            price,
            driverId: driverDoc._id.toString(),
            managementId: driverDoc.driverManagement[0],
          },
        },
      },
      { arrayFilters: [{ 'proposal.managementId': driverDoc.driverManagement[0] }] }
    );

  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateProposal });
};
