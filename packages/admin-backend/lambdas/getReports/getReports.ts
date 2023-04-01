export const getReportsHandler = async ({ arg, client }) => {
  console.log("🚀 ~ file: getReports.ts:5 ~ test3:", test3);
  const { lastDoc } = arg[0];
  if (lastDoc) {
    const results = await client
      .db("generalData")
      .collection("reports")
      .find({ _id: { $gt: new ObjectId(lastDoc) } })
      .limit(20)
      .toArray();
    return results;
  }
  const results = await client
    .db("generalData")
    .collection("reports")
    .find({})
    .limit(20)
    .toArray();
  return results;
};
interface GetReportsProps extends Omit<MainFunctionProps, "arg"> {}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
import { test3 } from "hyfn-types";
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getReportsHandler });
};
