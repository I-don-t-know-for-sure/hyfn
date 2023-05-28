import { getDriverDocumentHandler } from './getDriverDocument';

export type LambdaHandlers = {
  getDriverDocument: {
    arg: Parameters<typeof getDriverDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getDriverDocumentHandler>;
  };
};

/* 

getAvailableOrders
getProposals
updateNotificationTokens
createProposal
updateProposal
deleteProposal
setOrderAsDelivered
reportOrder
leaveOrder
takeOrder
getActiveOrders
setOrderAsPickedUp
setDeliveryFeePaid
confirmPickup
createDriverDocument
updateDriverDocument
getDriverDocument
getOrderHistory
generateImageUrl

*/
