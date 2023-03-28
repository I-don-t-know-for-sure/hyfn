import { Collection } from "mongodb";

export async function updateOne({ updateOneResult }: { updateOneResult: any }) {
  if (updateOneResult.matchedCount !== 1) {
    throw new Error("update did not happen");
  }
}
