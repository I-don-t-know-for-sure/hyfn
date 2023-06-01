import type {
  LambdaHandlers,
  AddLocalCardPaymentAPIKey,
} from "../packages/Store-backend/lambdas";
import type {
  LambdaHandlers as ManagementHandlers,
  DriverManagementHandlers,
  ReadOnlyTransactions,
} from "../packages/driver-management-backend/lambdas";

import type {
  LambdaHandlers as CustomerHandlers,
  TransactionsHandler,
} from "../packages/customer-backend/lambdas";
import type { LambdaHandlers as DriverHandlers } from "../packages/driver-backend/lambdas";
import type { LambdaHandlers as AdminHandlers } from "../packages/admin-backend/lambdas";

type Methods = "POST" | "GET";
export const storeUrl = ({
  method,
  url,
}: {
  method: Methods;
  url:
    | keyof LambdaHandlers
    | keyof DriverManagementHandlers
    | keyof ReadOnlyTransactions
    | keyof TransactionsHandler
    | keyof AddLocalCardPaymentAPIKey;
}) => {
  return `${method} /${url}`;
};

export const managementUrl = ({
  method,
  url,
}: {
  method: Methods;
  url:
    | keyof ManagementHandlers
    | keyof DriverManagementHandlers
    | keyof ReadOnlyTransactions
    | keyof AddLocalCardPaymentAPIKey;
}) => {
  return `${method} /${url}`;
};
export const adminUrl = ({
  method,
  url,
}: {
  method: Methods;
  url: keyof AdminHandlers;
}) => {
  return `${method} /${url}`;
};
type CustomerLambdaHandlers = CustomerHandlers & TransactionsHandler;
export const customerUrl = ({
  method,
  url,
}: {
  method: Methods;
  url: keyof CustomerLambdaHandlers;
}) => {
  return `${method} /${url}`;
};
export const driverUrl = ({
  method,
  url,
}: {
  method: Methods;
  url: keyof DriverHandlers;
}) => {
  return `${method} /${url}`;
};

export const getStage = (stage: any) => {
  if (stage === "development") {
    return "development";
  }
  if (stage === "staging") {
    return "staging";
  }
  if (stage === "production") {
    return "production";
  }
  return "development";
};
const pathToLambdas = "./packages/driver-management-backend/lambdas/";
const pathToLambdasCustomer = "./packages/customer-backend/lambdas/";
const pathToLambdasStore = "./packages/Store-backend/lambdas/";
// stores & managements
export const driversManagement = {
  "POST /removeFromManagementDrivers": {
    function: {
      handler: pathToLambdas + "removeDriverFromManagementDrivers.handler",
    },
  },
  "POST /updateDriverBalance": {
    function: {
      handler: pathToLambdas + "updateDriverBalance.handler",
    },
  },
  "POST /getDriverInfo": {
    function: {
      handler: pathToLambdas + "getDriverInfo.handler",
    },
  },
  "POST /addDriverToManagementDrivers": {
    function: {
      handler: pathToLambdas + "addDriverToManagementDrivers.handler",
    },
  },
  "POST /getTrustedDrivers": {
    function: {
      handler: pathToLambdas + "getTrustedDrivers.handler",
    },
  },
  "POST /searchDriverById": {
    function: {
      handler: pathToLambdas + "searchDriverById.handler",
    },
  },
  "POST /getAllDrivers": {
    function: {
      handler: pathToLambdas + "getAllDrivers.handler",
    },
  },
  "POST /replaceOrderDriver": {
    function: {
      handler: pathToLambdas + "replaceOrderDriver.handler",
    },
  },
};
// customers & stores
export const transactions = {
  "POST /getTransactionsList": {
    function: {
      handler: pathToLambdasCustomer + "getTransactionsList.handler",
    },
  },
};

// stores & managements
export const localCardKey = {
  [storeUrl({ method: "POST", url: "addLocalCardPaymentAPIKey" })]: {
    function: {
      handler: pathToLambdasStore + "addLocalCardPaymentAPIKey.handler",
    },
  },
  [storeUrl({ method: "POST", url: "disableLocalCardAPIKeys" })]: {
    function: {
      handler: pathToLambdasStore + "disableLocalCardAPIKeys.handler",
    },
  },
};
