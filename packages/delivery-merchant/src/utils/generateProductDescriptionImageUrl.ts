import fetchUtil from "./fetch";

export async function generateProductDescriptionImageUrl(images: any) {
  return await fetchUtil({
    url: `${import.meta.env.VITE_APP_BASE_URL}/generateImageReaderPutUrl`,
    reqData: [{ numberOfImages: images?.length }],
  });
}
