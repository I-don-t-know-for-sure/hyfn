import type {
  LambdaHandlers,
  GetOrder,
  LocalCard
} from "../packages/Store-backend/lambdas";

import type {
  LambdaHandlers as CustomerHandlers,
  TransactionsHandler
} from "../packages/customer-backend/lambdas";

import type { LambdaHandlers as AdminHandlers } from "../packages/admin-backend/lambdas";

const pathToLambdas = "./packages/driver-management-backend/lambdas/";
const pathToLambdasCustomer = "./packages/customer-backend/lambdas/";
const pathToLambdasStore = "./packages/Store-backend/lambdas/";
type Methods = "POST" | "GET";
export const storeUrl = ({
  method,
  url
}: {
  method: Methods;
  url:
    | keyof LambdaHandlers
    | keyof TransactionsHandler
    | keyof LocalCard
    | keyof GetOrder;
}) => {
  return `${method} /${url}`;
};

export const managementUrl = ({
  method,
  url
}: {
  method: Methods;
  url: keyof LocalCard;
}) => {
  return `${method} /${url}`;
};
export const adminUrl = ({
  method,
  url
}: {
  method: Methods;
  url: keyof AdminHandlers;
}) => {
  return `${method} /${url}`;
};
type CustomerLambdaHandlers = CustomerHandlers & TransactionsHandler;
export const customerUrl = ({
  method,
  url
}: {
  method: Methods;
  url: keyof CustomerLambdaHandlers | keyof GetOrder;
}) => {
  return `${method} /${url}`;
};
export const driverUrl = ({
  method,
  url
}: {
  method: Methods;
  url: keyof GetOrder;
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

// customers & stores
export const transactions = {
  "POST /getTransactions": {
    function: {
      handler: pathToLambdasCustomer + "getTransactions.handler"
    }
  },
  [customerUrl({ url: "cancelTransaction", method: "POST" })]: {
    function: {
      handler: pathToLambdasCustomer + "cancelTransaction.handler"
    }
  }
};

// stores
export const localCardKey = {
  [storeUrl({ method: "POST", url: "addLocalCardPaymentAPIKey" })]: {
    function: {
      handler: pathToLambdasStore + "addLocalCardPaymentAPIKey.handler"
    }
  },
  [storeUrl({ method: "POST", url: "disableLocalCardAPIKeys" })]: {
    function: {
      handler: pathToLambdasStore + "disableLocalCardAPIKeys.handler"
    }
  }
};
