interface SetDriverAsVerifiedProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { driverId } = arg[0];
    const result = await client
      .db("generalData")
      .collection("driverData")
      .updateOne(
        { _id: new ObjectId(driverId) },
        {
          $set: {
            verified: true,
          },
        }
      );
    return result;
  };
  return await mainWrapper({ event, mainFunction });
};
