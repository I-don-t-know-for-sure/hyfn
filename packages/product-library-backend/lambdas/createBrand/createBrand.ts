export const createBrandHandler = async ({ arg, client }) => {
    var result;
    const { creatorId, brandInfo } = arg[0];
    const brandId = new ObjectId();
    await client
        .db("productsLibrary")
        .collection("brands")
        .insertOne({
        _id: brandId,
        creatorId,
        value: brandId.toString(),
        ...brandInfo,
    });
    return result;
};
interface CreateBrandProps extends Omit<MainFunctionProps, "arg"> {
    arg: any;
}
("use strict");
import { mainWrapper, MainFunctionProps } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
    return await mainWrapper({ event, ctx, mainFunction: createBrandHandler });
};
