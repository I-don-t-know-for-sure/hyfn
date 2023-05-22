import fetchUtil from "utils/fetch";

const useUploadImage = () => {
  const uploadImage = async (files: any) => {
    if (
      files === "" ||
      files === undefined ||
      (Array.isArray(files) && !(files?.length > 0))
    )
      return [];
    const { generatedURLs, generatedNames } = await fetchUtil({
      url: `${import.meta.env.VITE_APP_BASE_URL}/generateImageURL`,
      reqData: [files.length],
    });

    // await user.functions.uploadImages([data]);
    for (let i = 0; i < files.length; i++) {
      // await files?.forEach(async (file, index) => {
      const file = files[i];
      const generatedIndex = i;

      const status = await fetch(generatedURLs[generatedIndex][0], {
        method: "PUT",
        headers: {
          "content-Type": "multipart/form",
        },
        body: file,
      });

      // const devices = ["initial", "mobile", "tablet", "laptop"];
      // [
      //   { width: 300, height: 300 },
      //   { width: 500, height: 500 },
      //   { width: 700, height: 700 },
      // ].forEach(async (dimensions, index) => {
      //   const screenSize = index + 1;
      //   fetch(
      //     `https:ik.imagekit.io/productiamge/${devices[0]}/${generatedNames[generatedIndex]}?tr=w-${dimensions.width}`
      //   ).then(async (response) => {
      //     const type = response.headers.get("content-type");
      //     const blob = await response.blob();
      //     const file = new File([blob], "newfile", { type });

      //     const optimizingStatus = await fetch(
      //       generatedURLs[generatedIndex][screenSize],
      //       {
      //         method: "PUT",
      //         headers: {
      //           "content-Type": type,
      //         },
      //         body: file,
      //       }
      //     );

      //   });
      // });
    }

    return generatedNames;
  };
  return uploadImage;
};

export default useUploadImage;
