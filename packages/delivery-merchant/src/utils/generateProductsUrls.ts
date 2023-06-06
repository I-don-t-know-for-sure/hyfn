import { fetchApi } from "./fetch";

export const generateProductsUrls = async (numberOfUrls: number) => {
  const { generatedURLs, generatedNames } = await fetchApi({
    url: `generateImageURL`,
    arg: [numberOfUrls],
  });

  return { generatedURLs, generatedNames };
};
