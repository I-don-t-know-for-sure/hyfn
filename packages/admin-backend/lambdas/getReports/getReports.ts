import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";

import { test3 } from "hyfn-types";

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
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
  return await mainWrapper({ event, mainFunction });
};
