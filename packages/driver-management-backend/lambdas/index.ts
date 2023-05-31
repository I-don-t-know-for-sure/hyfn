import { disableLocalCardKeysHandler } from './DisableLocalCardKeys';
import { addDriverToManagementDriversHandler } from './addDriverToManagementDrivers';
import { addUserAsEmployeeHandler } from './addEmployee';
import { addLocalCardKeysHandler } from './addLocalCardKeys';
import { createManagementHandler } from './createManagement';
import { getActiveOrdersHandler } from './getActiveOrders';
import { getAllDriversHandler } from './getAllDrivers';
import { getDriverInfoHandler } from './getDriverInfo';
import { getManagementHandler } from './getManagement';
import { getOrderHistoryHandler } from './getOrderHistory';
import { getTransactions } from './getTransactions';
import { getTrustedDriversHandler } from './getTrustedDrivers';
import { removeDriverFromManagementDriversHandler } from './removeDriverFromManagementDrivers';
import { replaceOrderDriverHandler } from './replaceOrderDriver';
import { reportOrderHandler } from './reportOrder';
import { searchDriverByIdHandler } from './searchDriverById';
import { updateDriverBalanceHandler } from './updateDriverBalance';

export type LambdaHandlers = {
  getManagementDocument: {
    arg: Parameters<typeof getManagementHandler>['0']['arg'];
    return: ReturnType<typeof getManagementHandler>;
  };
  addLocalCardKeys: {
    arg: Parameters<typeof addLocalCardKeysHandler>['0']['arg'];
    return: ReturnType<typeof addLocalCardKeysHandler>;
  };
  addEmployee: {
    arg: Parameters<typeof addUserAsEmployeeHandler>['0']['arg'];
    return: ReturnType<typeof addUserAsEmployeeHandler>;
  };
  DisableLocalCardKeys: {
    arg: Parameters<typeof disableLocalCardKeysHandler>['0']['arg'];
    return: ReturnType<typeof disableLocalCardKeysHandler>;
  };
  reportOrder: {
    arg: Parameters<typeof reportOrderHandler>['0']['arg'];
    return: ReturnType<typeof reportOrderHandler>;
  };

  createManagement: {
    arg: Parameters<typeof createManagementHandler>['0']['arg'];
    return: ReturnType<typeof createManagementHandler>;
  };
  getActiveOrders: {
    arg: Parameters<typeof getActiveOrdersHandler>['0']['arg'];
    return: ReturnType<typeof getActiveOrdersHandler>;
  };
  getOrderHistory: {
    arg: Parameters<typeof getOrderHistoryHandler>['0']['arg'];
    return: ReturnType<typeof getOrderHistoryHandler>;
  };
  updateManagementInfo: {
    arg: Parameters<typeof getManagementHandler>['0']['arg'];
    return: ReturnType<typeof getManagementHandler>;
  };
};
export type DriverManagementHandlers = {
  getAllDrivers: {
    arg: Parameters<typeof getAllDriversHandler>['0']['arg'];
    return: ReturnType<typeof getAllDriversHandler>;
  };
  replaceOrderDriver: {
    arg: Parameters<typeof replaceOrderDriverHandler>['0']['arg'];
    return: ReturnType<typeof replaceOrderDriverHandler>;
  };
  searchDriverById: {
    arg: Parameters<typeof searchDriverByIdHandler>['0']['arg'];
    return: ReturnType<typeof searchDriverByIdHandler>;
  };
  getTrustedDrivers: {
    arg: Parameters<typeof getTrustedDriversHandler>['0']['arg'];
    return: ReturnType<typeof getTrustedDriversHandler>;
  };
  addDriverToManagementDrivers: {
    arg: Parameters<typeof addDriverToManagementDriversHandler>['0']['arg'];
    return: ReturnType<typeof addDriverToManagementDriversHandler>;
  };
  getDriverInfo: {
    arg: Parameters<typeof getDriverInfoHandler>['0']['arg'];
    return: ReturnType<typeof getManagementHandler>;
  };
  updateDriverBalance: {
    arg: Parameters<typeof updateDriverBalanceHandler>['0']['arg'];
    return: ReturnType<typeof updateDriverBalanceHandler>;
  };
  removeFromManagementDrivers: {
    arg: Parameters<typeof removeDriverFromManagementDriversHandler>['0']['arg'];
    return: ReturnType<typeof removeDriverFromManagementDriversHandler>;
  };
};
export type ReadOnlyTransactions = {
  getTransactions: {
    arg: Parameters<typeof getTransactions>['0']['arg'];
    return: ReturnType<typeof getTransactions>;
  };
};
