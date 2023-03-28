const { isDeepStrictEqual } = require("util");
const { countries } = require("./constents/countries");
const { deepStrictEqual } = require("assert");

exports.updateCountries = async ({
  future,
  current,
  client,
  index: datebaseName,
}) => {
  const checkedCurrent = typeof current !== "object" ? {} : current;
  const checkedFuture = typeof future !== "object" ? {} : future;
  for (const collectionName of Object.keys(checkedCurrent || {})) {
    const collection = current[collectionName];
    for (const index of collection) {
      const { key, ...rest } = index;
      const indexToBeDelete = future[collectionName].find(
        (index) => index.name === rest.name
      );
      if (!indexToBeDelete) {
        await client
          .db(datebaseName)
          .collection(collectionName)
          .dropIndex(rest.name);
      }
    }
  }
  for (const collectionName of Object.keys(checkedFuture || {})) {
    const collection = future[collectionName];
    for (const index of collection) {
      const { key, ...rest } = index;
      const currentIndex = current[collectionName].find(
        (index) => index.name === rest.name
      );
      if (!deepStrictEqual(currentIndex, index)) {
        // if we need to update the index we must drop and recreate the index with the new options
      }

      await client
        .db(datebaseName)
        .collection(collectionName)
        .createIndex(key, { ...rest });
    }
  }
};
