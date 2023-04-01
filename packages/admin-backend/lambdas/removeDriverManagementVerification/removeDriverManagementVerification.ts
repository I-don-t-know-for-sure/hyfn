interface RemoveDriverManagementVerificationProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const { driverManagement } = arg[0];
    await client
      .db("generalData")
      .collection("driverManagement")
      .updateOne(
        { _id: new ObjectId(driverManagement) },
        {
          $set: {
            verified: false,
          },
        },
        {}
      );

    return "seccuss";
  };
  return await mainWrapper({ event, mainFunction });
};
