interface GetUnverifiedDriversProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { lastDoc } = arg[0];
    if (lastDoc) {
      const results = await client
        .db("generalData")
        .collection("driverVerification")
        .find({ _id: { $gt: new ObjectId(lastDoc) }, verified: false })
        .limit(20)
        .toArray();
      return results;
    }
    const results = await client
      .db("generalData")
      .collection("driverData")
      .find({
        verified: false,
      })
      .limit(20)
      .toArray();
    return results;
  };

  return await mainWrapper({ event, mainFunction });
};
