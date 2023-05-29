interface AcceptProposalProps extends Omit<MainFunctionProps, 'arg'> {}
import { MainFunctionProps, mainWrapper } from 'hyfn-server';
import { returnsObj } from 'hyfn-types';
interface AcceptProposalProps extends Omit<MainFunctionProps, 'arg'> {
  arg: any[];
}
export const acceptProposal = async ({ arg, client, userId, db }: AcceptProposalProps) => {
  const { country, driverId, orderId } = arg[0];

  const customerDoc = await db
    .selectFrom('customers')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow();

  const orderDoc = await db
    .selectFrom('orders')
    .selectAll()
    .where('id', '=', orderId)
    .executeTakeFirstOrThrow();
  if (!orderDoc) {
    throw new Error(returnsObj['order not found']);
  }
  if (orderDoc?.orderStatus?.includes('canceled')) {
    throw new Error(returnsObj['order canceled']);
  }
  const proposal = orderDoc?.proposals?.find((proposal) => proposal.driverId === driverId);

  if (orderDoc.customerId !== customerDoc.id) {
    throw new Error(returnsObj['order is not for this user']);
  }
  if (!orderDoc.proposals.find((proposal) => proposal.driverId === driverId)) {
    throw new Error(returnsObj['driver managemnt not found']);
  }

  await db
    .updateTable('orders')
    .set({
      acceptedProposal: proposal.driverId,
    })
    .where('id', '=', orderId)
    .execute();
  return 'success';
};
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: acceptProposal });
};
