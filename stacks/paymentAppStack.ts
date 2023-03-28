import { StackContext, StaticSite } from "sst/constructs";
import { getStage } from "./getStage";
import { frConfig } from "../frEnvVaraibles";
const localhost = "http://localhost:";

export function paymentApp({ stack }: StackContext) {
  const stage = getStage(stack.stage);
  const site = new StaticSite(stack, "payment-app", {
    path: "./packages/payment-app",
    buildOutput: "dist",
    buildCommand: "yarn build",
    ...(stack.stage === "production"
      ? {
          customDomain: {
            domainName: "pay.hyfn.xyz",
            domainAlias: "www.pay.hyfn.xyz",
            hostedZone: "hyfn.xyz",
            // isExternalDomain: true,
          },
        }
      : {}),
    environment: {
      VITE_APP_MOAMALAT_PAYMEN_GATEWAY_URL:
        frConfig[stage].MOAMALAT_PAYMEN_GATEWAY_URL,
    },
  });
  stack.addOutputs({
    managmentSite: site.url || localhost + "3002",
  });
  return {
    site,
  };
}
