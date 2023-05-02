import { MainFunctionProps, mainWrapper } from "hyfn-server";
interface CreateAdminDocumentProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
export const createAdminDocumentHandler = async ({
  arg,
  client,
}: CreateAdminDocumentProps) => {
  const adminInfo = arg[0];
  const result = await client
    .db("generalData")
    .collection("adminInfo")
    .insertOne({
      ...adminInfo,
    });
  return result;
};
export const handler = async (event) => {
  return await mainWrapper({ mainFunction: createAdminDocumentHandler, event });
};
