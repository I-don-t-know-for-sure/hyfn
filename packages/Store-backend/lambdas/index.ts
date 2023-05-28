import { getStoreDocumentHandler } from './getStoreDocument';

export type LambdaHandlers = {
  getStoreDocument: {
    arg: Parameters<typeof getStoreDocumentHandler>['0']['arg'];
    return: ReturnType<typeof getStoreDocumentHandler>;
  };
};

/* 

getProducts
generateDescriptionClient
generateDescriptionClien
stopAcceptingOrders
updateNotificationTokens
addEmployee
updateSubscibtion
generateImageReaderPutUrl
removeAllProductsBackgrounds
setProductAsNotFound
setProductAsPickedUp
updateLocalCardSettings
disableLocalCardAPIKeys
setOrderAsAccepted
setOrderAsDelivered
getDriverInfo
addLocalCardPaymentAPIKey
setOrderAsReady
setOrderAsPreparing
createTransaction
createCollection
createStoreDocument
createProduct
getTransactionsList
validateLocalCardTransaction
deleteCollection
updateStoreOwnerInfo
updateStoreInfo
getAllCollections
getCollection
getActiveOrders
updateCollection
updateProduct
getCollectionsForProduct
deleteProduct
getProduct
getStoreDocument
updateProductState
openAndCloseStore
updatePaymentSettings
paySubscription
getOrderHistory
generateImageURL
rejectOrder
searchProducts
bulkWrite
getCollectionProducts
getProductsForCollection
bulkUpdate
updateOptions
getProductsForBulkUpdate
duplicateProduct
/getCollectionStoreFrontProducts

*/
