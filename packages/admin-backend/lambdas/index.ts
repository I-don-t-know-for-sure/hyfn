import { getReportsHandler } from "./getReports";

export type LambdaHandlers = {
  getReports: {
    arg: Parameters<typeof getReportsHandler>["0"]["arg"];
    return: ReturnType<typeof getReportsHandler>;
  };
};

/* 

createAdminDocument
getPaymentRequests
completePaymentRequest
createPaymentRequestObject
removeDriverManagementVerification
verifyDriverManagement
getDriverManagement
getUnverifiedDrivers
getReports
getAdminDocument
setDriverAsVerified

*/
