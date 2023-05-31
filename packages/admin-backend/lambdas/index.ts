import { completePaymentRequest } from "./completePaymentRequest";
import { createAdminDocumentHandler } from "./createAdminDocument";
import { createStoreLocalCardTransaction } from "./createPaymentRequestObject";
import { getAdminDocumentHandler } from "./getAdminDocument";
import { getDriverManagementHandler } from "./getDriverManagement";
import { getPaymentRequestsHandler } from "./getPaymentRequests";
import { getReportsHandler } from "./getReports";
import { getUnverifiedDriversHandler } from "./getUnverifiedDrivers";
import { removeDriverManagementVerificationHandler } from "./removeDriverManagementVerification";
import { setDriverAsVerifiedHandler } from "./setDriverAsVerified";
import { verifyDriverManagementHandler } from "./verifyDriverManagement";

export type LambdaHandlers = {
  getReports: {
    arg: Parameters<typeof getReportsHandler>["0"]["arg"];
    return: ReturnType<typeof getReportsHandler>;
  };
  setDriverAsVerified: {
    arg: Parameters<typeof setDriverAsVerifiedHandler>["0"]["arg"];
    return: ReturnType<typeof setDriverAsVerifiedHandler>;
  };
  getAdminDocument: {
    arg: Parameters<typeof getAdminDocumentHandler>["0"]["arg"];
    return: ReturnType<typeof getAdminDocumentHandler>;
  };
  getUnverifiedDrivers: {
    arg: Parameters<typeof getUnverifiedDriversHandler>["0"]["arg"];
    return: ReturnType<typeof getUnverifiedDriversHandler>;
  };
  getDriverManagement: {
    arg: Parameters<typeof getDriverManagementHandler>["0"]["arg"];
    return: ReturnType<typeof getDriverManagementHandler>;
  };
  verifyDriverManagement: {
    arg: Parameters<typeof verifyDriverManagementHandler>["0"]["arg"];
    return: ReturnType<typeof verifyDriverManagementHandler>;
  };
  removeDriverManagementVerification: {
    arg: Parameters<
      typeof removeDriverManagementVerificationHandler
    >["0"]["arg"];
    return: ReturnType<typeof removeDriverManagementVerificationHandler>;
  };
  createPaymentRequestObject: {
    arg: Parameters<typeof createStoreLocalCardTransaction>["0"]["arg"];
    return: ReturnType<typeof createStoreLocalCardTransaction>;
  };
  completePaymentRequest: {
    arg: Parameters<typeof completePaymentRequest>["0"]["arg"];
    return: ReturnType<typeof completePaymentRequest>;
  };
  getPaymentRequests: {
    arg: Parameters<typeof getPaymentRequestsHandler>["0"]["arg"];
    return: ReturnType<typeof getPaymentRequestsHandler>;
  };
  createAdminDocument: {
    arg: Parameters<typeof createAdminDocumentHandler>["0"]["arg"];
    return: ReturnType<typeof createAdminDocumentHandler>;
  };
};
