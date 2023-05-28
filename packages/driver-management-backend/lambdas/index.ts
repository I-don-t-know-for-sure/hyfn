import { getManagementHandler } from './getManagement';

export type LambdaHandlers = {
  getManagementDocument: {
    arg: Parameters<typeof getManagementHandler>['0']['arg'];
    return: ReturnType<typeof getManagementHandler>;
  };
};

/* 

addLocalCardKeys
addEmployee
getTransactions
getAllDrivers
replaceOrderDriver
DisableLocalCardKeys
reportOrder
searchDriverById
getTrustedDrivers
getManagement
addDriverToManagementDrivers
createManagement
getActiveOrders
getDriverInfo
getOrderHistory
updateDriverBalance
updateManagementInfo
removeFromManagementDrivers

*/
