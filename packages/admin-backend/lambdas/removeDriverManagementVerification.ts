import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
import { returnsObj } from "hyfn-types";
interface RemoveDriverManagementVerificationProps
  extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const removeDriverManagementVerificationHandler = async ({
  arg,
  client,
}: RemoveDriverManagementVerificationProps) => {
  const { driverManagement } = arg[0];
  await client
    .db("generalData")
    .collection("driverManagement")
    .updateOne(
      { id: new ObjectId(driverManagement) },
      {
        $set: {
          verified: false,
        },
      },
      {}
    );
  return returnsObj["seccuss"];
};
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: removeDriverManagementVerificationHandler,
  });
};
