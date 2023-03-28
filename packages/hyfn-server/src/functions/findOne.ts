export async function findOne({ findOneResult }: { findOneResult: any }) {
  if (!findOneResult) {
    console.log(`document from query  not found }`);

    // throw new Error(`document from query  in  not found`);
  }
}
