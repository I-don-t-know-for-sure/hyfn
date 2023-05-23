export const updateProductHandler = async ({
  arg,
  client,
}: MainFunctionProps) => {
  var result;
  const {
    creatorId,
    productId,
    newProductInfo: { imagesURLs, ...rest },
    deletedImages,
  } = arg[0];

  const oldProduct = await client
    .db("productsLibrary")
    .collection("products")
    .findOne({ id: new ObjectId(productId) });
  const updatedImages = oldProduct?.images?.filter(
    (image) => !deletedImages?.some((deletedImage) => deletedImage === image)
  );

  const status = await client
    .db("productsLibrary")
    .collection("products")
    .updateOne(
      { id: new ObjectId(productId) },
      {
        $set: {
          ...rest,
          barcode: rest.barcode.trim(),
          images: [...updatedImages, ...imagesURLs],
        },
      }
    );

  return result;
};
interface UpdateProductProps extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
("use strict");
import { MainFunctionProps, mainWrapper } from "hyfn-server";
import { ObjectId } from "mongodb";
export const handler = async (event, ctx) => {
  return await mainWrapper({ event, ctx, mainFunction: updateProductHandler });
};
