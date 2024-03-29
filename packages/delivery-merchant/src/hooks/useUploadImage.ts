/* import {fetchApi} from 'utils/fetch'












const useUploadImage = () => {
  const uploadImage = async (files: any) => {
    if (files === '' || files === undefined || (Array.isArray(files) && !(files?.length > 0))) return []
    const { generatedURLs, generatedNames } = await fetchApi({
      url: `generateImageURL`,
      arg: [files.length],
    })

    // await user.functions.uploadImages([data]);
    for (let i = 0; i < files.length; i++) {
      // await files?.forEach(async (file, index) => {
      const file = files[i]
      const generatedIndex = i

      const status = await fetch(generatedURLs[generatedIndex][0], {
        method: 'PUT',
        headers: {
          'content-Type': 'multipart/form',
        },
        body: file,
      })
    }

    return generatedNames
  }
  return uploadImage
}

export default useUploadImage
 */

import { fetchApi } from "utils/fetch";

const useUploadImage = () => {
  const uploadImage = async ({
    files,
    generatedNames,
    generatedURLs,
  }: {
    files: any;
    generatedURLs: any;
    generatedNames: any;
  }) => {
    if (
      files === "" ||
      files === undefined ||
      (Array.isArray(files) && !(files?.length > 0))
    )
      return [];

    // const { generatedURLs, generatedNames } = await fetchApi({
    //   url: `generateImageURL`,
    //   arg: [files.length],
    // });

    // await user.functions.uploadImages([data]);
    for (let i = 0; i < files.length; i++) {
      // await files?.forEach(async (file, index) => {
      const file = files[i];
      console.log(generatedURLs, "sjbdhcbhdbchbdhcbh");

      const generatedIndex = i;
      console.log(
        "🚀 ~ file: useUploadImage.ts:76 ~ //awaitfiles?.forEach ~ generatedIndex:",
        generatedIndex
      );
      console.log(generatedURLs[generatedIndex], "sjbdhcbhdbchbdhcbh");

      const status = await fetch(generatedURLs[generatedIndex], {
        method: "PUT",
        headers: {
          "content-Type": "multipart/form",
        },
        body: file,
      });
    }

    return generatedNames;
  };
  return uploadImage;
};

export default useUploadImage;
