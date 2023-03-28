import { mainWrapper } from "hyfn-server";

export const handler = async (event) => {
  const mainFunction = async ({ arg, client }) => {
    const adminInfo = arg[0];
    const result = await client
      .db("generalData")
      .collection("adminInfo")
      .insertOne({
        ...adminInfo,
      });

    return result;
  };

  return await mainWrapper({ mainFunction, event });
};
