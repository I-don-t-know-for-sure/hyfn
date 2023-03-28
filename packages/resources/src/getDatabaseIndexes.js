exports.getDatabaseIndexes = async (client) => {
  let databaseIndexes = {};

  const country = await client.db("base");
  let collectionNames = await (
    await country.listCollections().toArray()
  ).map((collectionName) => collectionName.name);
  console.log(
    "🚀 ~ file: getDatabaseIndexes.js:24 ~ collectionNames:",
    collectionNames
  );

  for (const collectionName of collectionNames) {
    const indexes = await country.collection(collectionName).indexes();

    databaseIndexes = {
      ...databaseIndexes,
      ["base"]: {
        ...databaseIndexes["base"],
        [collectionName]: indexes.map((index) => {
          const { v, ...rest } = index;
          return rest;
        }),
      },
    };
  }
  setTimeout(() => console.log("1 second"), 1000);

  const generalData = await client.db("generalData");

  collectionNames = await (
    await generalData.listCollections().toArray()
  ).map((collectionName) => collectionName.name);

  for (const collectionName of collectionNames) {
    const indexes = await generalData.collection(collectionName).indexes();

    databaseIndexes = {
      ...databaseIndexes,

      ["generalData"]: {
        ...databaseIndexes["generalData"],

        [collectionName]: indexes.map((index) => {
          const { v, ...rest } = index;
          return rest;
        }),
      },
    };
  }

  const productsLibrary = await client.db("productsLibrary");

  collectionNames = await (
    await productsLibrary.listCollections().toArray()
  ).map((collectionName) => collectionName.name);

  for (const collectionName of collectionNames) {
    const indexes = await productsLibrary.collection(collectionName).indexes();

    databaseIndexes = {
      ...databaseIndexes,
      ["productsLibrary"]: {
        ...databaseIndexes["productLibrary"],
        [collectionName]: indexes.map((index) => {
          const { v, ...rest } = index;
          return rest;
        }),
      },
    };
  }

  setTimeout(() => console.log("1 second"), 1000);
  return databaseIndexes;
};
