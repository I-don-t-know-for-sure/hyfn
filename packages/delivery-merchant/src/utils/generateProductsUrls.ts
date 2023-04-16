import fetchUtil from "./fetch";

export const generateProductsUrls = async (numberOfUrls: number) => {
  const { generatedURLs, generatedNames } = await fetchUtil({
    url: `${import.meta.env.VITE_APP_BASE_URL}/generateImageURL`,
    reqData: [numberOfUrls],
  });

  return { generatedURLs, generatedNames };
};
