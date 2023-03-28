import { s3 } from '../s3';

export const deleteImages = async (imageKeys) => {
  const sizeArray = [
    { folder: 'laptop', sizes: [350, 350] },
    { folder: 'preview', sizes: [550, 550] },
    { folder: 'mobile', sizes: [150, 150] },
    { folder: 'tablet', sizes: [200, 200] },
  ];

  const deleteArray = imageKeys.flatMap((key) => {
    if (key === 'c72e349a9bc184cbdcfb1386060d4b5b') {
      return [];
    }
    let deleteArrayFromAllFolders = [];
    for (let i = 0; i < sizeArray.length; i++) {
      deleteArrayFromAllFolders.push({ Key: `${sizeArray[i].folder}/${key}` });
    }
    return deleteArrayFromAllFolders;
  });
  const bucketName = process.env.bucketName;
  const params = {
    Bucket: bucketName,
    Delete: { Objects: deleteArray },
  };
  console.log(params);

  const data = await s3.deleteObjects(params).promise();
  console.log(data);
};
