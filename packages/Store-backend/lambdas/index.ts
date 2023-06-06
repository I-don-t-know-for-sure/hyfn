import { addUserAsEmployeeHandler } from './addEmployee';
import { createCollection } from './createCollectionWithActive';
import { createProductHandler } from './createProduct';
import { createStoreDocumentHandler } from './createStoreDocument';
import { createLocalCardTransactionForWallet } from './createTransaction';
import { deleteCollectionHandler } from './deleteCollection';
import { deleteProductHandler } from './deleteProduct';

import { disableLocalCardAPIKeysHandler } from './disableLocalCardAPIKeys';
import { duplicateProductHandler } from './duplicateProduct';
import { generateDescriptionClientHandler } from './generateDescriptionClient';
import { generateImageReaderPutUrlHandler } from './generateImageReaderPutUrl';
import { getActiveOrdersHandler } from './getActiveOrders';
import { getAllCollectionsHandler } from './getAllCollections';
import { getCollectionHandler } from './getCollection';
import { getCollectionStoreFrontProductsHandler } from './getCollectionStoreFrontProducts';
import { getCollectionsForProductHandler } from './getCollectionsForProduct';
import { getDriverInfoHandler } from './getDriverInfo';
import { getProductHandler } from './getProduct';
import { getProducts } from './getProducts';
import { getProductsForBulkUpdateHandler } from './getProductsForBulkUpdate';
import { getStoreDocumentHandler } from './getStoreDocument';
import { getTransactionsList } from './getTransactionsList';
import { removeAllProductsBackgroundsHandler } from './removeAllProductsBackgrounds';
import { setOrderAsAcceptedHandler } from './setOrderAsAccepted';
import { setOrderAsDeliveredHandler } from './setOrderAsPickedUp';
import { setOrderAsPreparingHandler } from './setOrderAsPreparing';
import { setOrderAsReadyHandler } from './setOrderAsReady';
import { setProductAsNotFoundHandler } from './setProductAsNotFound';
import { setProductAsPickedUpHandler } from './setProductAsPickedUp';
import { stopAcceptingOrders } from './stopAcceptingOrders';
import { updateCollectionHandler } from './updateCollection';
import { updateLocalCardSettingsHandler } from './updateLocalCardSettings';
import { updateNotificationTokensHandler } from './updateNotificationTokens';
import { updateOptionsHandler } from './updateOptions';
import { updateProductHandler } from './updateProduct';
import { updateProductStateHandler } from './updateProductState';
import { updateStoreDriverSettings } from './updateStoreDriversSettings';
import { updateStoreInfoHandler } from './updateStoreInfo';
import { updateSubscibtionHandler } from './updateSubscibtion';
import { getProductsForCollectionHandler } from './getProductsForCollection';
import { getCollectionProductsHandler } from './getCollectionProducts';
import { bulkWriteHandler } from './bulkWrite';
import { searchProductsHandler } from './searchProducts';
import { rejectOrderHandler } from './rejectOrder';
import { generateImageURL } from './generateImageURL';
import { getOrderHistoryHandler } from './getOrderHistory';
import { paySubscriptionHandler } from './paySubscription';
import { updatePaymentSettingsHandler } from './updatePaymentSettings';
import { openAndCloseStoreHandler } from './openAndCloseStore';
import { addLocalCardPaymentAPIKey } from './addLocalCardPaymentAPIKey';
import { bulkUpdateHandler } from './bulkUpdate';
import { validateLocalCardTransaction } from './validateLocalCardTransaction';
import { getOrder } from './getOrder';
import { deleteLocalCardAPIKey } from './deleteLocalCardAPIKey';
import { updateStoreOwnerInfoHandler } from './updateStoreOwnerInfo';

export type LambdaHandlers = {
  getStoreDocument: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  disableLocalCardAPIKeys: {
    arg: Parameters<typeof disableLocalCardAPIKeysHandler>['0']['arg'];
    return: ReturnType<typeof disableLocalCardAPIKeysHandler>;
  };
  updateLocalCardSettings: {
    arg: Parameters<typeof updateLocalCardSettingsHandler>['0']['arg'];
    return: ReturnType<typeof updateLocalCardSettingsHandler>;
  };
  setProductAsPickedUp: {
    arg: Parameters<typeof setProductAsPickedUpHandler>['0']['arg'];
    return: ReturnType<typeof setProductAsPickedUpHandler>;
  };
  setProductAsNotFound: {
    arg: Parameters<typeof setProductAsNotFoundHandler>['0']['arg'];
    return: ReturnType<typeof setProductAsNotFoundHandler>;
  };
  removeAllProductsBackgrounds: {
    arg: Parameters<typeof removeAllProductsBackgroundsHandler>['0']['arg'];
    return: ReturnType<typeof removeAllProductsBackgroundsHandler>;
  };
  generateImageReaderPutUrl: {
    arg: Parameters<typeof generateImageReaderPutUrlHandler>['0']['arg'];
    return: ReturnType<typeof generateImageReaderPutUrlHandler>;
  };
  updateSubscibtion: {
    arg: Parameters<typeof updateSubscibtionHandler>['0']['arg'];
    return: ReturnType<typeof updateSubscibtionHandler>;
  };
  addEmployee: {
    arg: Parameters<typeof addUserAsEmployeeHandler>['0']['arg'];
    return: ReturnType<typeof addUserAsEmployeeHandler>;
  };
  updateNotificationTokens: {
    arg: Parameters<typeof updateNotificationTokensHandler>['0']['arg'];
    return: ReturnType<typeof updateNotificationTokensHandler>;
  };
  stopAcceptingOrders: {
    arg: Parameters<typeof stopAcceptingOrders>['0']['arg'];
    return: ReturnType<typeof stopAcceptingOrders>;
  };
  // generateDescriptionClien: {
  //   arg: Parameters<typeof generateDescriptionClientHandler>['0']['arg'];
  //   return: ReturnType<typeof generateDescriptionClientHandler>;
  // };
  generateDescriptionClient: {
    arg: Parameters<typeof generateDescriptionClientHandler>['0']['arg'];
    return: ReturnType<typeof generateDescriptionClientHandler>;
  };
  getProducts: {
    arg: Parameters<typeof getProducts>['0']['arg'];
    return: ReturnType<typeof getProducts>;
  };
  updateProductState: {
    arg: Parameters<typeof updateProductStateHandler>['0']['arg'];
    return: ReturnType<typeof updateProductStateHandler>;
  };
  getProduct: {
    arg: Parameters<typeof getProductHandler>['0']['arg'];
    return: ReturnType<typeof getProductHandler>;
  };
  deleteProduct: {
    arg: Parameters<typeof deleteProductHandler>['0']['arg'];
    return: ReturnType<typeof deleteProductHandler>;
  };
  getCollectionsForProduct: {
    arg: Parameters<typeof getCollectionsForProductHandler>['0']['arg'];
    return: ReturnType<typeof getCollectionsForProductHandler>;
  };
  updateProduct: {
    arg: Parameters<typeof updateProductHandler>['0']['arg'];
    return: ReturnType<typeof updateProductHandler>;
  };
  updateCollection: {
    arg: Parameters<typeof updateCollectionHandler>['0']['arg'];
    return: ReturnType<typeof updateCollectionHandler>;
  };
  getActiveOrders: {
    arg: Parameters<typeof getActiveOrdersHandler>['0']['arg'];
    return: ReturnType<typeof getActiveOrdersHandler>;
  };
  getCollection: {
    arg: Parameters<typeof getCollectionHandler>['0']['arg'];
    return: ReturnType<typeof getCollectionHandler>;
  };
  getAllCollections: {
    arg: Parameters<typeof getAllCollectionsHandler>['0']['arg'];
    return: ReturnType<typeof getAllCollectionsHandler>;
  };
  updateStoreInfo: {
    arg: Parameters<typeof updateStoreInfoHandler>['0']['arg'];
    return: ReturnType<typeof updateStoreInfoHandler>;
  };
  deleteCollection: {
    arg: Parameters<typeof deleteCollectionHandler>['0']['arg'];
    return: ReturnType<typeof deleteCollectionHandler>;
  };
  validateLocalCardTransaction: {
    arg: Parameters<typeof validateLocalCardTransaction>['0']['arg'];
    return: ReturnType<typeof validateLocalCardTransaction>;
  };
  getTransactionsList: {
    arg: Parameters<typeof getTransactionsList>['0']['arg'];
    return: ReturnType<typeof getTransactionsList>;
  };
  createProduct: {
    arg: Parameters<typeof createProductHandler>['0']['arg'];
    return: ReturnType<typeof createProductHandler>;
  };
  createStoreDocument: {
    arg: Parameters<typeof createStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof createStoreDocumentHandler>;
  };
  createCollection: {
    arg: Parameters<typeof createCollection>['0']['arg'];
    return: ReturnType<typeof createCollection>;
  };
  createTransaction: {
    arg: Parameters<typeof createLocalCardTransactionForWallet>['0']['arg'];
    return: ReturnType<typeof createLocalCardTransactionForWallet>;
  };
  setOrderAsPreparing: {
    arg: Parameters<typeof setOrderAsPreparingHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsPreparingHandler>;
  };
  setOrderAsReady: {
    arg: Parameters<typeof setOrderAsReadyHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsReadyHandler>;
  };

  getDriverInfo: {
    arg: Parameters<typeof getDriverInfoHandler>['0']['arg'];
    return: ReturnType<typeof getDriverInfoHandler>;
  };
  setOrderAsDelivered: {
    arg: Parameters<typeof setOrderAsDeliveredHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsDeliveredHandler>;
  };
  setOrderAsAccepted: {
    arg: Parameters<typeof setOrderAsAcceptedHandler>['0']['arg'];
    return: ReturnType<typeof setOrderAsAcceptedHandler>;
  };
  getCollectionStoreFrontProducts: {
    arg: Parameters<typeof getCollectionStoreFrontProductsHandler>['0']['arg'];
    return: ReturnType<typeof getCollectionStoreFrontProductsHandler>;
  };
  duplicateProduct: {
    arg: Parameters<typeof duplicateProductHandler>['0']['arg'];
    return: ReturnType<typeof duplicateProductHandler>;
  };
  getProductsForBulkUpdate: {
    arg: Parameters<typeof getProductsForBulkUpdateHandler>['0']['arg'];
    return: ReturnType<typeof getProductsForBulkUpdateHandler>;
  };
  updateOptions: {
    arg: Parameters<typeof updateOptionsHandler>['0']['arg'];
    return: ReturnType<typeof updateOptionsHandler>;
  };
  bulkUpdate: {
    arg: Parameters<typeof bulkUpdateHandler>['0']['arg'];
    return: ReturnType<typeof bulkUpdateHandler>;
  };
  getProductsForCollection: {
    arg: Parameters<typeof getProductsForCollectionHandler>['0']['arg'];
    return: ReturnType<typeof getProductsForCollectionHandler>;
  };
  getCollectionProducts: {
    arg: Parameters<typeof getCollectionProductsHandler>['0']['arg'];
    return: ReturnType<typeof getCollectionProductsHandler>;
  };
  bulkWrite: {
    arg: Parameters<typeof bulkWriteHandler>['0']['arg'];
    return: ReturnType<typeof bulkWriteHandler>;
  };
  searchProducts: {
    arg: Parameters<typeof searchProductsHandler>['0']['arg'];
    return: ReturnType<typeof searchProductsHandler>;
  };
  rejectOrder: {
    arg: Parameters<typeof rejectOrderHandler>['0']['arg'];
    return: ReturnType<typeof rejectOrderHandler>;
  };
  generateImageURL: {
    arg: Parameters<typeof generateImageURL>['0']['arg'];
    return: ReturnType<typeof generateImageURL>;
  };
  getOrderHistory: {
    arg: Parameters<typeof getOrderHistoryHandler>['0']['arg'];
    return: ReturnType<typeof getOrderHistoryHandler>;
  };
  paySubscription: {
    arg: Parameters<typeof paySubscriptionHandler>['0']['arg'];
    return: ReturnType<typeof paySubscriptionHandler>;
  };
  updatePaymentSettings: {
    arg: Parameters<typeof updatePaymentSettingsHandler>['0']['arg'];
    return: ReturnType<typeof updatePaymentSettingsHandler>;
  };
  openAndCloseStore: {
    arg: Parameters<typeof openAndCloseStoreHandler>['0']['arg'];
    return: ReturnType<typeof openAndCloseStoreHandler>;
  };
  updateStoreDriversSettings: {
    arg: Parameters<typeof updateStoreDriverSettings>['0']['arg'];
    return: ReturnType<typeof updateStoreDriverSettings>;
  };

  updateStoreOwnerInfo: {
    arg: Parameters<typeof updateStoreOwnerInfoHandler>['0']['arg'];
    return: ReturnType<typeof updateStoreOwnerInfoHandler>;
  };
};

export type GetOrder = {
  getOrder: {
    arg: Parameters<typeof getOrder>['0']['arg'];
    return: ReturnType<typeof getOrder>;
  };
};
export type LocalCard = {
  addLocalCardPaymentAPIKey: {
    arg: Parameters<typeof addLocalCardPaymentAPIKey>['0']['arg'];
    return: ReturnType<typeof addLocalCardPaymentAPIKey>;
  };
  deleteLocalCardAPIKey: {
    arg: Parameters<typeof deleteLocalCardAPIKey>['0']['arg'];
    return: ReturnType<typeof deleteLocalCardAPIKey>;
  };
};
