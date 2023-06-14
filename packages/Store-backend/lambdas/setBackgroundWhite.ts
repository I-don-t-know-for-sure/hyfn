import {
  MainFunctionProps,
  mainWrapper,
  tProducts,
  tStores
} from "hyfn-server";
import { backgroundRemovalPerImage, imageQualityArray } from "hyfn-types";
import request from "request";
import fs from "fs";

import AWS, { S3 } from "aws-sdk";
import Jimp from "jimp";

import { multiply, smaller, subtract } from "mathjs";
import axios from "axios";
import { getDb } from "hyfn-server/src/functions/getDb";
import { sql } from "kysely";
const s3 = new AWS.S3();

interface setBackgroundWhite extends Omit<MainFunctionProps, "arg"> {
  arg: any;
}
const api_url = "https://api.backgroundremoverai.com/v1/convert/";
const results_url = "https://api.backgroundremoverai.com/v1/results/";
const api_result_url = "https://api.backgroundremoverai.com";

export const setBackgroundWhiteHandler = async ({
  productIds,
  db,
  eventBusName,
  url,
  storeId
}: {
  url: string;

  productIds: string[];
  storeId: string;
  eventBusName: string;
  db: MainFunctionProps["db"];
}) => {
  console.log("🚀 ~ file: setBackgroundWhite.ts:36 ~ storeId:", storeId);
  console.log("🚀 ~ file: setBackgroundWhite.ts:36 ~ productIds:", productIds);
  const productId = productIds.pop();
  const newKeys = await db.transaction().execute(async (trx) => {
    const product = await trx
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .executeTakeFirstOrThrow();
    const newKeys = product.images.filter((image) => {
      return !product?.whiteBackgroundImages?.find(
        (whiteBackgroundImage) => whiteBackgroundImage === image
      );
    });
    if (newKeys.length === 0) {
      throw new Error("no keys");
    }
    console.log(
      "🚀 ~ file: setBackgroundWhite.ts:55 ~ newKeys ~ newKeys:",
      newKeys
    );

    // let newKeys = [];

    // Check if the array has at least 5 elements

    /////////////////////////////

    const storeDoc = await trx
      .selectFrom("stores")
      .selectAll()
      .where("id", "=", storeId)
      .executeTakeFirstOrThrow();
    const price = backgroundRemovalPerImage * newKeys.length;

    if (smaller(storeDoc.balance, price)) {
      throw new Error("balance not enough");
    }

    await trx
      .updateTable("stores")
      .set({
        balance: sql`${sql.raw(tStores.balance)} - ${price}`
      })
      .where("id", "=", storeId)
      .executeTakeFirst();
    ///////////////////////////////

    ///////////////////////////

    await trx
      .updateTable("products")
      .set({
        whiteBackgroundImages: sql`${sql.raw(
          tProducts.whiteBackgroundImages[0]._
        )} || array[${sql.join(newKeys)}]`
      })
      .where("id", "=", productId)
      .executeTakeFirst();
    ///////////////////////////
    return newKeys;
  });
  var returnPriceInCaseOfError = multiply(
    newKeys.length,
    backgroundRemovalPerImage
  );
  const bucket = process.env.bucketName;
  const files = [];
  try {
    for (const key of newKeys) {
      const formData = {
        lang: "en",
        convert_to: "image-backgroundremover",
        files: []
      } as any;
      const getObjectParams = {
        Bucket: bucket,
        Key: "initial/" + key
      };

      const getObjectResult = await s3.getObject(getObjectParams).promise();
      const tmpPath = `/tmp/${key}.jpg`;
      await fs.promises.writeFile(tmpPath, getObjectResult.Body as any);

      const strem = fs.createReadStream(tmpPath);

      formData.files.push(strem);

      const convertRequest = {
        url: api_url,
        method: "post",
        formData: formData,
        headers: {
          Authorization: "2c91437a82df4e6192ae5be05b8c8136",
          "Content-Type": "multipart/form-data"
        }
      };

      const result = await new Promise((resolve, reject) => {
        request(convertRequest, (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(body));
          }
        });
      });

      const resultsRequest = {
        url: results_url,
        method: "POST",
        formData: result
      };

      const results: any = await new Promise((resolve, reject) => {
        const pollResults = () => {
          request(resultsRequest, (err, response, body) => {
            if (err) {
              reject(err);
            } else {
              const result = JSON.parse(body);
              if (result.finished) {
                resolve(result);
              } else {
                setTimeout(pollResults, 1000);
              }
            }
          });
        };
        pollResults();
      });
      const file = results.files[0];
      /////////////////////
      const imageKey = file.url
        .split("/")
        [file.url.split("/").length - 1].split(".")[0];
      // var sizeArray = [
      //   { folder: "preview", sizes: [] },
      //   { folder: "mobile", sizes: [150, 150] },
      //   { folder: "tablet", sizes: [300, 300] }
      // ];

      for (let i = 0; i < imageQualityArray.length; i++) {
        var screen = imageQualityArray[i];

        // Use the sharp module to resize the image and save in a buffer.
        try {
          var originalImage = await Jimp.read(`${api_result_url}${file.url}`);
          var productImage;
          // if (screen.folder === "preview") {
          productImage = await originalImage
            .resize(
              originalImage.bitmap.width,
              originalImage.bitmap.height,
              Jimp.RESIZE_BEZIER
            )
            .quality(screen.quality);
          // } else {
          // productImage = await originalImage
          //   .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
          //   .quality(100);
          // }
          const whiteImage = new Jimp(
            productImage.getWidth(),
            productImage.getHeight(),
            0xffffffff
          );

          // Composite the images
          var buffer = await whiteImage
            .composite(productImage, 0, 0)
            .getBufferAsync(Jimp.AUTO as any);
        } catch (error) {
          throw error;
        }
        // Upload the thumbnail image to the destination bucket
        try {
          const destparams = {
            Bucket: process.env.bucketName,
            Key: `${screen.folder}/${imageKey}`,
            Body: buffer,
            ContentType: "image"
          };
          const promise = [buffer];
          Promise.allSettled(promise).then((values) => {
            console.log(values);
          });

          const putResult = await s3.putObject(destparams).promise();

          ////////
          const putPromis = [putResult];

          Promise.allSettled(putPromis).then((values) => {
            console.log(values);
          });
        } catch (error) {
          throw error;
        }
      }

      /////////////////////
      files.push(results.files[0]);
      returnPriceInCaseOfError = subtract(
        returnPriceInCaseOfError,
        backgroundRemovalPerImage
      );
    }

    /* for (const file of files) {
      const imageKey = file.url
      .split("/")
      [file.url.split("/").length - 1].split(".")[0];
      var sizeArray = [
        { folder: "preview", sizes: [] },
        { folder: "mobile", sizes: [150, 150] },
        { folder: "tablet", sizes: [300, 300] }
      ];
      
      for (let i = 0; i < sizeArray.length; i++) {
        var screen = sizeArray[i];
        
        // Use the sharp module to resize the image and save in a buffer.
        try {
          var originalImage = await Jimp.read(`${api_result_url}${file.url}`);
          var productImage;
          if (screen.folder === "preview") {
            productImage = await originalImage
            .resize(
              originalImage.bitmap.width,
              originalImage.bitmap.height,
              Jimp.RESIZE_BEZIER
              )
              .quality(100);
            } else {
              productImage = await originalImage
              .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
              .quality(100);
            }
            const whiteImage = new Jimp(
              productImage.getWidth(),
              productImage.getHeight(),
              0xffffffff
              );
              
              // Composite the images
              var buffer = await whiteImage
              .composite(productImage, 0, 0)
              .getBufferAsync(Jimp.AUTO as any);
            } catch (error) {
              throw error;
            }
            // Upload the thumbnail image to the destination bucket
            try {
              const destparams = {
                Bucket: process.env.bucketName,
                Key: `${screen.folder}/${imageKey}`,
                Body: buffer,
                ContentType: "image"
              };
              const promise = [buffer];
              Promise.allSettled(promise).then((values) => {
                console.log(values);
              });
              
              const putResult = await s3.putObject(destparams).promise();
              
              ////////
              const putPromis = [putResult];
              
              Promise.allSettled(putPromis).then((values) => {
                console.log(values);
              });
            } catch (error) {
              throw error;
            }
          }
        } */
  } catch (error) {
    await db
      .updateTable("stores")
      .set({
        balance: sql`${sql.raw(tStores.balance)} + ${returnPriceInCaseOfError}`
      })
      .where("id", "=", storeId)
      .execute();
    throw new Error(error);
  }

  if (productIds.length > 0) {
    axios
      .post(url, {
        productIds,
        storeId,
        url
      })
      .catch((err) => {
        throw err;
      });
  }

  return "success";
};

export const handler = async (event) => {
  const { eventBusName, productIds, storeId, url } = JSON.parse(event.body);
  const db = await getDb();

  return await setBackgroundWhiteHandler({
    productIds,
    eventBusName,
    db,
    storeId,
    url
  });
};
