interface DeleteProposalProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { driverSchema, USER_TYPE_DRIVER } from 'hyfn-types';
import { smaller } from 'mathjs';

import { returnsObj } from 'hyfn-types';
import { z } from 'zod';
interface DeleteProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any;
}
export const deleteProposal = async ({ arg, client, userId, db }: DeleteProposalProps) => {
  const { country, orderId } = arg[0];

  const driverDoc = await db
    .selectFrom('drivers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();
  if (!driverDoc) {
    throw new Error(returnsObj['driver doc not found']);
  }

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (!orderDoc) {
    throw new Error('order not found');
  }
  if (orderDoc.orderStatus.includes('canceled')) {
    throw new Error(returnsObj['Order canceled']);
  }
  if (orderDoc.acceptedProposal) {
    throw new Error(returnsObj['customer already accepted a proposal']);
  }
  var removed = false;
  const newProposalIds = orderDoc.proposalsIds.filter((proposalId) => {
    const check = proposalId !== driverDoc.driverManagement && removed;
    if (proposalId === driverDoc.driverManagement) {
      removed = true;
    }
    return check;
  });
  const proposals = orderDoc.proposals.filter((proposal) => {
    return driverDoc.id !== proposal.driverId;
  });
  await db
    .updateTable('orders')
    .set({
      proposalsIds: newProposalIds,
      proposals,
    })
    .where('id', '=', orderId)
    .executeTakeFirst();

  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: deleteProposal });
};
