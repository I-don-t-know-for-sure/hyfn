import { acceptProposal } from './acceptProposal';
import { createUserDocument } from './createUserDocument';
import { getStoreFronts } from './getStoreFronts';
import { updateUserDocumentHandler } from './updateUserDocument';
export type LambdaHandlers = {
  getStoreFronts: {
    arg: Parameters<typeof getStoreFronts>['0']['arg'];
    return: ReturnType<typeof getStoreFronts>;
  };
  acceptProposal: {
    arg: Parameters<typeof acceptProposal>['0']['arg'];
    return: ReturnType<typeof acceptProposal>;
  };
  createCustomer: {
    arg: Parameters<typeof createUserDocument>['0']['arg'];
    return: ReturnType<typeof createUserDocument>;
  };
  updateCustomer: {
    arg: Parameters<typeof updateUserDocumentHandler>['0']['arg'];
    return: ReturnType<typeof updateUserDocumentHandler>;
  };
};

/* 

getStoreFronts
createTransaction
validateTransaction
cancelTransaction
sendNotification
updateNotificationTokens
confirmPickup
acceptProposal
getCustomerData
setOrderAsDelivered
getOrderDocument
setProductAsNotFound
setProductAsPickedUp
createOrderData
getProduct
getStoreFront
getActiveOrders
getOrderHistory
getCollectionProducts
getBalance
getDriverInfo
cancelOrder
reportOrder
getTransactionsList
createUserDocument
getTransactions
updateUserDocument
updateAddresses

*/
