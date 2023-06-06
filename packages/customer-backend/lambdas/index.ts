import { acceptProposal } from './acceptProposal';
import { createUserDocument } from './createUserDocument';
import { getStoreFronts } from './getStoreFronts';
import { createlocalCardTransaction } from './createTransaction';
import { updateUserDocumentHandler } from './updateUserDocument';
import { validateLocalCardTransaction } from './validateTransaction';
import { cancelTransaction } from './cancelTransaction';
import { updateNotificationTokensHandler } from './updateNotificationTokens';
import { confirmPickup } from './confirmPickup';
import { getCustomerData } from './getCustomerData';
import { setOrderAsDeliveredHandler } from './setOrderAsDelivered';

import { setProductAsNotFoundHandler } from './setProductAsNotFound';
import { setProductAsPickedUpHandler } from './setProductAsPickedUp';
import { createOrderData } from './createOrderData';
import { getProduct } from './getProduct';
import { getStoreFront } from './getStoreFront';
import { getActiveOrders } from './getActiveOrders';
import { getOrderHistory } from './getOrderHistory';
import { getCollectionProducts } from './getCollectionProducts';
import { GetDriverInfo } from './getDriverInfo';
import { cancelOrder } from './cancelOrder';
import { reportOrderHandler } from './reportOrder';
import { getTransactions } from './getTransactions';
import { updateAddressesHandler } from './updateAddresses';
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
  getOrderHistory: {
    arg: Parameters<typeof getOrderHistory>['0']['arg'];
    return: ReturnType<typeof getOrderHistory>;
  };
  getActiveOrders: {
    arg: Parameters<typeof getActiveOrders>['0']['arg'];
    return: ReturnType<typeof getActiveOrders>;
  };
  getStoreFront: {
    arg: Parameters<typeof getStoreFront>['0']['arg'];
    return: ReturnType<typeof getStoreFront>;
  };
  getProduct: {
    arg: Parameters<typeof getProduct>['0']['arg'];
    return: ReturnType<typeof getProduct>;
  };
  createOrderData: {
    arg: Parameters<typeof createOrderData>['0']['arg'];
    return: ReturnType<typeof createOrderData>;
  };
  setProductAsPickedUp: {
    arg: Parameters<typeof setProductAsPickedUpHandler>['0']['arg'];
    return: ReturnType<typeof setProductAsPickedUpHandler>;
  };
  setProductAsNotFound: {
    arg: Parameters<typeof setProductAsNotFoundHandler>['0']['arg'];
    return: ReturnType<typeof setProductAsNotFoundHandler>;
  };

  setOrderAsDelivered: {
    arg: Parameters<typeof setOrderAsDeliveredHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsDeliveredHandler>;
  };
  getCustomerData: {
    arg: Parameters<typeof getCustomerData>['0']['arg'];
    return: ReturnType<typeof getCustomerData>;
  };

  confirmPickup: {
    arg: Parameters<typeof confirmPickup>['0']['arg'];
    return: ReturnType<typeof confirmPickup>;
  };
  updateNotificationTokens: {
    arg: Parameters<typeof updateNotificationTokensHandler>['0']['arg'];
    return: ReturnType<typeof updateNotificationTokensHandler>;
  };
  cancelTransaction: {
    arg: Parameters<typeof cancelTransaction>['0']['arg'];
    return: ReturnType<typeof cancelTransaction>;
  };
  validateTransaction: {
    arg: Parameters<typeof validateLocalCardTransaction>['0']['arg'];
    return: ReturnType<typeof validateLocalCardTransaction>;
  };
  getCollectionProducts: {
    arg: Parameters<typeof getCollectionProducts>['0']['arg'];
    return: ReturnType<typeof getCollectionProducts>;
  };
  createTransaction: {
    arg: Parameters<typeof createlocalCardTransaction>['0']['arg'];
    return: ReturnType<typeof createlocalCardTransaction>;
  };
  updateAddresses: {
    arg: Parameters<typeof updateAddressesHandler>['0']['arg'];
    return: ReturnType<typeof updateAddressesHandler>;
  };
  updateUserDocument: {
    arg: Parameters<typeof updateUserDocumentHandler>['0']['arg'];
    return: ReturnType<typeof updateUserDocumentHandler>;
  };
  createUserDocument: {
    arg: Parameters<typeof createUserDocument>['0']['arg'];
    return: ReturnType<typeof createUserDocument>;
  };
  reportOrder: {
    arg: Parameters<typeof reportOrderHandler>['0']['arg'];
    return: ReturnType<typeof reportOrderHandler>;
  };
  cancelOrder: {
    arg: Parameters<typeof cancelOrder>['0']['arg'];
    return: ReturnType<typeof cancelOrder>;
  };
  getDriverInfo: {
    arg: Parameters<typeof GetDriverInfo>['0']['arg'];
    return: ReturnType<typeof GetDriverInfo>;
  };
};
export type TransactionsHandler = {
  getTransactions: {
    arg: Parameters<typeof getTransactions>['0']['arg'];
    return: ReturnType<typeof getTransactions>;
  };
  cancelTransaction: {
    arg: Parameters<typeof cancelTransaction>['0']['arg'];
    return: ReturnType<typeof cancelTransaction>;
  };
};
