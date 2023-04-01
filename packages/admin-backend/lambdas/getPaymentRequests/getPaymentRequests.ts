interface GetPaymentRequestsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { MainFunctionProps, mainWrapper } from "hyfn-server";

const { ObjectId } = require("mongodb");

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { lastDoc } = arg[0];

    if (lastDoc) {
      const requests = await client
        .db("generalData")
        .collection("paymentRequests")
        .find({ _id: { $gt: new ObjectId(lastDoc) }, validated: false })
        .limit(10)
        .toArray();
      return requests;
    }
    const requests = await client
      .db("generalData")
      .collection("paymentRequests")
      .find({ validated: false })
      .limit(10)
      .toArray();
    return requests;
  };
  return await mainWrapper({ event, mainFunction });
};
