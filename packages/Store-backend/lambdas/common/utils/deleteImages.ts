import { imageQualityArray } from "hyfn-types";
import { s3 } from "../s3";
export const deleteImages = async (imageKeys) => {
  const deleteArray = imageKeys.flatMap((key) => {
    if (key === "c72e349a9bc184cbdcfb1386060d4b5b") {
      return [];
    }
    let deleteArrayFromAllFolders = [];
    for (let i = 0; i < imageQualityArray.length; i++) {
      deleteArrayFromAllFolders.push({
        Key: `${imageQualityArray[i].folder}/${key}`
      });
    }
    return deleteArrayFromAllFolders;
  });
  const bucketName = process.env.bucketName;
  const params = {
    Bucket: bucketName,
    Delete: { Objects: deleteArray }
  };

  const data = await s3.deleteObjects(params).promise();
};
