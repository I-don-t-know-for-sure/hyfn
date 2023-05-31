interface UpdateProposalProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';

import { returnsObj } from 'hyfn-types';
interface UpdateProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const updateProposal = async ({ arg, client, userId, db }: UpdateProposalProps) => {
  const { country, orderId, price } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (!driverDoc) {
    throw new Error(returnsObj['driver not found']);
  }
  if (driverDoc.reportsIds.length > 0) {
    throw new Error('You have a reported order');
  }
  console.log(driverDoc, 'hshshshssh');

  if (!driverDoc.verified) {
    throw new Error(returnsObj['you are not verified']);
  }
  if (!driverDoc.driverManagement) {
    throw new Error('You are not trusted by a driver management');
  }

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (!orderDoc) {
    throw new Error('order not found');
  }
  if (orderDoc.acceptedProposal) {
    throw new Error(returnsObj['customer already accepted a proposal']);
  }

  const updatedProposals = orderDoc.proposals.map((proposal) => {
    if (proposal.driverId === driverDoc.id) {
      return {
        ...proposal,
        price,
      };
    }
    return proposal;
  });
  await db
    .updateTable('orders')
    .set({
      proposals: updatedProposals,
    })
    .where('id', '=', orderId)
    .executeTakeFirst();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: updateProposal });
};
