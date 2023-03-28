import { MainFunctionProps, mainWrapper } from "hyfn-server";

const { ObjectId } = require("mongodb");

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }: MainFunctionProps) => {
    const { driverManagement } = arg[0];
    const driverManagementDoc = await client
      .db("generalData")
      .collection("driverManagement")
      .findOne({ _id: new ObjectId(driverManagement) }, {});
    return driverManagementDoc;
  };
  return await mainWrapper({ event, mainFunction });
};
