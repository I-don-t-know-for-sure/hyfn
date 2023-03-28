import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { USER_TYPE_CUSTOMER } from 'hyfn-types';
import { ObjectId } from 'mongodb';

interface AcceptProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const acceptProposal = async ({ arg, client, userId }: AcceptProposalProps) => {
  const { country, driverManagementId, orderId } = arg[0];
  const customerDoc = await client
    .db('generalData')
    .collection('customerInfo')
    .findOne({ customerId: userId });

  const orderDoc = await client
    .db('base')
    .collection('orders')
    .findOne({ _id: new ObjectId(orderId) });
  if (!orderDoc) {
    throw new Error('order not found');
  }
  if (orderDoc.canceled) {
    throw new Error('order canceled');
  }
  const customerStatus = orderDoc.status.find((status) => status.userType === USER_TYPE_CUSTOMER);

  if (customerStatus._id !== customerDoc._id.toString()) {
    throw new Error('order is not for this user');
  }

  if (!orderDoc.proposals.find((proposal) => proposal.managementId === driverManagementId)) {
    throw new Error('driver managemnt not found');
  }

  await client
    .db('base')
    .collection('orders')
    .updateOne(
      {
        _id: new ObjectId(orderId),
      },
      {
        $set: {
          acceptedProposal: driverManagementId,
        },
        // $pullAll: { proposals: { $elemMatch: { management: {$ne:driverManagementId} } } }
      }
    );
  return 'success';
};

export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: acceptProposal });
};
