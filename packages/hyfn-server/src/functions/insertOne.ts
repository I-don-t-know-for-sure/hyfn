export const insertOne = async ({
  insertOneResult,
}: {
  insertOneResult: any;
}) => {
  if (!insertOneResult.insertedId) {
    throw new Error("error");
  }
};
