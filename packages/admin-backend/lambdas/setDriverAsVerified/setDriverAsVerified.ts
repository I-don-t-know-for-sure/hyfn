export const setDriverAsVerifiedHandler = async ({ arg, client }) => {
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
interface SetDriverAsVerifiedProps extends Omit<MainFunctionProps, "arg"> {}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: setDriverAsVerifiedHandler });
};
