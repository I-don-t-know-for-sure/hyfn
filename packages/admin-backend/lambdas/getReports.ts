export const getReportsHandler = async ({ arg, client }) => {
  const { lastDoc } = arg[0];
  if (lastDoc) {
    const results = await client
      .db("generalData")
      .collection("reports")
      .find({ id: { $gt: new ObjectId(lastDoc) } })
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
interface GetReportsProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
import { test3 } from "hyfn-types";
export const handler = async (event) => {
  return await mainWrapper({ event, mainFunction: getReportsHandler });
};
