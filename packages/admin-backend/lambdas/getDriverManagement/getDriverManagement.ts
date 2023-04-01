import { MainFunctionProps, mainWrapper } from "hyfn-server";
interface GetDriverManagementProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const getDriverManagementHandler = async ({
  arg,
  client,
}: GetDriverManagementProps) => {
  const { driverManagement } = arg[0];
  const driverManagementDoc = await client
    .db("generalData")
    .collection("driverManagement")
    .findOne({ _id: new ObjectId(driverManagement) }, {});
  return driverManagementDoc;
};
const { ObjectId } = require("mongodb");
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getDriverManagementHandler });
};
