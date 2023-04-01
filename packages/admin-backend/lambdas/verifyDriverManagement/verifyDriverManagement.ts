export const verifyDriverManagementHandler = async ({ arg, client }) => {
  const { driverManagement } = arg[0];
  await client
    .db("generalData")
    .collection("driverManagement")
    .updateOne(
      { _id: new ObjectId(driverManagement) },
      {
        $set: {
          verified: true,
        },
      },
      {}
    );
  return "success";
};
interface VerifyDriverManagementProps extends Omit<MainFunctionProps, "arg"> {}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event) => {
  return await mainWrapper({
    event,
    mainFunction: verifyDriverManagementHandler,
  });
};
