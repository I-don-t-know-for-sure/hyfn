import { addUserAsEmployeeHandler } from './addEmployee';
import { cancelTransaction } from './cancelTransaction';
import { disableLocalCardAPIKeysHandler } from './disableLocalCardAPIKeys';
import { generateDescriptionClientHandler } from './generateDescriptionClient';
import { generateImageReaderPutUrlHandler } from './generateImageReaderPutUrl';
import { getStoreDocumentHandler } from './getStoreDocument';
import { removeAllProductsBackgroundsHandler } from './removeAllProductsBackgrounds';
import { setProductAsNotFoundHandler } from './setProductAsNotFound';
import { setProductAsPickedUpHandler } from './setProductAsPickedUp';
import { stopAcceptingOrders } from './stopAcceptingOrders';
import { updateLocalCardSettingsHandler } from './updateLocalCardSettings';
import { updateNotificationTokensHandler } from './updateNotificationTokens';
import { updateSubscibtionHandler } from './updateSubscibtion';

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
  generateDescriptionClien: {
    arg: Parameters<typeof generateDescriptionClientHandler>['0']['arg'];
    return: ReturnType<typeof generateDescriptionClientHandler>;
  };
  generateDescriptionClient: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getProducts: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updateProductState: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  deleteProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getCollectionsForProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updateProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updateCollection: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getActiveOrders: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getCollection: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getAllCollections: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updateStoreInfo: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  deleteCollection: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  validateLocalCardTransaction: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getTransactionsList: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  createProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  createStoreDocument: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  createCollection: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  createTransaction: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  setOrderAsPreparing: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  setOrderAsReady: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  addLocalCardPaymentAPIKey: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getDriverInfo: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  setOrderAsDelivered: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  setOrderAsAccepted: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getCollectionStoreFrontProducts: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  duplicateProduct: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getProductsForBulkUpdate: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updateOptions: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  bulkUpdate: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getProductsForCollection: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getCollectionProducts: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  bulkWrite: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  searchProducts: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  rejectOrder: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  generateImageURL: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  getOrderHistory: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  paySubscription: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  updatePaymentSettings: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  openAndCloseStore: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
  cancelTransaction: {
    arg: Parameters<typeof cancelTransaction>['0']['arg'];
    return: ReturnType<typeof cancelTransaction>;
  };
};
