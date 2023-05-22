export async function resizeAndSaveImages(origimage, dstBucket, imageKey, Jimp, s3) {
  const sizeArray = [
    // { folder: 'laptop', sizes: [350, 350] },
    { folder: 'preview', sizes: [] },
    { folder: 'mobile', sizes: [150, 150] },
    { folder: 'tablet', sizes: [300, 300] },
  ];

  const promises = [];

  for (let i = 0; i < sizeArray.length; i++) {
    const screen = sizeArray[i];
    let buffer;
    const original = await Jimp.read(origimage.Body);
    if (screen.folder === 'preview') {
      buffer = await (await Jimp.read(origimage.Body))
        .resize(original.bitmap.width, original.bitmap.height, Jimp.RESIZE_BEZIER)
        .quality(100)
        .getBufferAsync(Jimp.AUTO);
    } else {
      buffer = await (await Jimp.read(origimage.Body))
        .resize(screen.sizes[0], screen.sizes[1], Jimp.RESIZE_BEZIER)
        .quality(100)
        .getBufferAsync(Jimp.AUTO);
    }
    const destparams = {
      Bucket: dstBucket,
      Key: `${screen.folder}/${imageKey}`,
      Body: buffer,
      ContentType: 'image',
    };

    const putResult = s3.putObject(destparams).promise();

    promises.push(putResult);
  }

  try {
    const values = await Promise.allSettled(promises);
  } catch (error) {
    console.error(error);
    return;
  }
}
