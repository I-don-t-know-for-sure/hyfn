import { createDriverDocumentHandler } from './createDriverDocument';
import { createProposal } from './createProposal';
import { deleteProposal } from './deleteProposal';
import { generateImageUrl } from './generateImageUrl';
import { getActiveOrderHandler } from './getActiveOrders';
import { getAvailableOrders } from './getAvailableOrders';
import { getDriverDocumentHandler } from './getDriverDocument';
import { getOrderHistoryHandler } from './getOrderHistory';
import { getProposals } from './getProposals';
import { leaveOrderHandler } from './leaveOrder';
import { reportOrderHandler } from './reportOrder';
import { setDeliveryFeePaid } from './setDeliveryFeePaid';
import { setOrderAsDeliveredHandler } from './setOrderAsDelivered';
import { setOrderAsPickedUpHandler } from './setOrderAsPickedUp';
import { takeOrderHandler } from './takeOrder';
import { updateDriverDocumentHandler } from './updateDriverDocument';
import { updateNotificationTokensHandler } from './updateNotificationTokens';
import { updateProposal } from './updateProposal';

export type LambdaHandlers = {
  getDriverDocument: {
    arg: Parameters<typeof getDriverDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getDriverDocumentHandler>;
  };

  generateImageUrl: {
    arg: Parameters<typeof generateImageUrl>['0']['arg'];
    return: ReturnType<typeof generateImageUrl>;
  };
  getOrderHistory: {
    arg: Parameters<typeof getOrderHistoryHandler>['0']['arg'];
    return: ReturnType<typeof getOrderHistoryHandler>;
  };

  updateDriverDocument: {
    arg: Parameters<typeof updateDriverDocumentHandler>['0']['arg'];
    return: ReturnType<typeof updateDriverDocumentHandler>;
  };
  createDriverDocument: {
    arg: Parameters<typeof createDriverDocumentHandler>['0']['arg'];
    return: ReturnType<typeof createDriverDocumentHandler>;
  };

  setDeliveryFeePaid: {
    arg: Parameters<typeof setDeliveryFeePaid>['0']['arg'];
    return: ReturnType<typeof setDeliveryFeePaid>;
  };
  setOrderAsPickedUp: {
    arg: Parameters<typeof setOrderAsPickedUpHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsPickedUpHandler>;
  };
  getActiveOrders: {
    arg: Parameters<typeof getActiveOrderHandler>['0']['arg'];
    return: ReturnType<typeof getActiveOrderHandler>;
  };
  takeOrder: {
    arg: Parameters<typeof takeOrderHandler>['0']['arg'];
    return: ReturnType<typeof takeOrderHandler>;
  };
  leaveOrder: {
    arg: Parameters<typeof leaveOrderHandler>['0']['arg'];
    return: ReturnType<typeof leaveOrderHandler>;
  };
  reportOrder: {
    arg: Parameters<typeof reportOrderHandler>['0']['arg'];
    return: ReturnType<typeof reportOrderHandler>;
  };
  setOrderAsDelivered: {
    arg: Parameters<typeof setOrderAsDeliveredHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsDeliveredHandler>;
  };
  deleteProposal: {
    arg: Parameters<typeof deleteProposal>['0']['arg'];
    return: ReturnType<typeof deleteProposal>;
  };
  updateProposal: {
    arg: Parameters<typeof updateProposal>['0']['arg'];
    return: ReturnType<typeof updateProposal>;
  };
  createProposal: {
    arg: Parameters<typeof createProposal>['0']['arg'];
    return: ReturnType<typeof createProposal>;
  };
  updateNotificationTokens: {
    arg: Parameters<typeof updateNotificationTokensHandler>['0']['arg'];
    return: ReturnType<typeof updateNotificationTokensHandler>;
  };
  getProposals: {
    arg: Parameters<typeof getProposals>['0']['arg'];
    return: ReturnType<typeof getProposals>;
  };
  getAvailableOrders: {
    arg: Parameters<typeof getAvailableOrders>['0']['arg'];
    return: ReturnType<typeof getAvailableOrders>;
  };
};
