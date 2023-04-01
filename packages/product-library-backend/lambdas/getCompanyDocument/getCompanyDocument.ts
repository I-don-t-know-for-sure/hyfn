export const getCompanyDocumentHandler = async ({ arg, client }) => {
  var result;
  const { userId } = arg[0];
  result = await client
    .db("generalData")
    .collection("companyInfo")
    .findOne({ userId });
  return result === null ? {} : result;
};
interface GetCompanyDocumentProps extends Omit<MainFunctionProps, "arg"> {}
("use strict");
import { mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getCompanyDocumentHandler,
  });
};
