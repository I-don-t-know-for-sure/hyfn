import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { driverSchema, USER_TYPE_DRIVER } from 'hyfn-types';
import { smaller } from 'mathjs';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

interface DeleteProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}

export const deleteProposal = async ({ arg, client, userId }: DeleteProposalProps) => {
  const { country, orderId } = arg[0];
  const projection = {};
  type DriverDoc = z.infer<typeof driverSchema>;
  const driverDoc = await client
    .db('generalData')
    .collection('driverData')
    .findOne<DriverDoc>({ driverId: userId });

  if (!driverDoc) {
    throw new Error('driver doc not found');
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
  if (orderDoc.acceptedProposal) {
    throw new Error('customer already accepted a proposal');
  }
  await client
    .db('base')
    .collection('orders')
    .updateOne(
      { _id: new ObjectId(orderId) },
      {
        $pull: {
          proposalsIds: driverDoc.driverManagement[0],
          proposals: {
            managementId: driverDoc.driverManagement[0],
          },
        },
      }
    );
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: deleteProposal });
};
