("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
interface GetAdminDocumentProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const getAdminDocumentHandler = async ({
  arg,
  client,
}: GetAdminDocumentProps) => {
  var result;
  const { userId } = arg[0];
  result = await client
    .db("generalData")
    .collection("adminInfo")
    .findOne({ userId }, {});

  return result;
};
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({
    event,
    ctx,
    mainFunction: getAdminDocumentHandler,
  });
};
