import { fetchApi } from "./fetch";

export async function generateProductDescriptionImageUrl(images: any) {
  return await fetchApi({
    url: `generateImageReaderPutUrl`,
    arg: [{ numberOfImages: images?.length }],
  });
}
