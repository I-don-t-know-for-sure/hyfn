const { resolve } = require("path");
const { getDatabaseIndexes } = require("./getDatabaseIndexes");
const { getMongodbClient } = require("./getMongodbClient");
const { updateCountries } = require("./updateCountries");
////
////kdmckdmckd
///
///
///////
(async () => {
  const env = process.argv[2];
  const client = await getMongodbClient(env);

  try {
    await client.connect();
    const fileSystem = require("fs");
    const fs = fileSystem.promises;
    const future = JSON.parse(
      await (
        await fs.readFile(`./src/constents/currentDatabaseIndexes.json`)
      ).toString()
    );
    const current = await getDatabaseIndexes(client);
    console.log("sbxhsbxhsb");
    console.log("🚀 ~ file: compareAndChange.js:22 ~ current:", current);

    const futureGeneralData = future["generalData"];
    console.log(
      "🚀 ~ file: compareAndChange.js:28 ~ futureGeneralData:",
      futureGeneralData
    );
    const currentGeneralData = current["generalData"];
    console.log(
      "🚀 ~ file: compareAndChange.js:30 ~ currentGeneralData:",
      currentGeneralData
    );
    const myPromise = new Promise((resolve, reject) => {
      updateCountries({
        client,
        current: currentGeneralData,
        future: futureGeneralData,
        index: "generalData",
      });
      resolve();
    }).then((data) => console.log("hbxshb"));
    // for (const collectionName of Object.keys(currentGeneralData)) {
    //   const collection = currentGeneralData[collectionName];
    //   for (const index of collection) {
    //     const { key, ...rest } = index;
    //     const indexToBeDelete = futureGeneralData[collectionName].find(
    //       (index) => index.name === rest.name
    //     );
    //     if (!indexToBeDelete) {
    //       console.log(
    //         "🚀 ~ file: updateCountries.js:12 ~ exports.updateCountries= ~ indexToBeDelete:",
    //         indexToBeDelete
    //       );

    //       //   for (const country of countries) {
    //       await client
    //         .db("generalData")
    //         .collection(collectionName)
    //         .dropIndex(rest.name);
    //       //   }
    //     }
    //   }
    // }
    // for (const collectionName of Object.keys(futureGeneralData)) {
    //   const collection = futureGeneralData[collectionName];
    //   for (const index of collection) {
    //     // for (const country of countries) {
    //     const { key, ...rest } = index;
    //     // console.log(
    //     //   "🚀 ~ file: addNewCountry.js:27 ~ collection.forEach ~ rest:",
    //     //   rest
    //     // );
    //     await client
    //       .db("generalData")
    //       .collection(collectionName)
    //       .createIndex(key, { ...rest });
    //     // }
    //   }
    // }

    const currentCountryIndexes = current["base"];
    console.log(
      "🚀 ~ file: compareAndChange.js:86 ~ currentCountryIndexes:",
      currentCountryIndexes
    );

    const futureCountryIndexes = future["base"];
    console.log(
      "🚀 ~ file: compareAndChange.js:88 ~ futureCountryIndexes:",
      futureCountryIndexes
    );

    await updateCountries({
      client,
      current: currentCountryIndexes,
      future: futureCountryIndexes,
      index: "base",
    });
    const futureProductsLibrary = future["productsLibrary"];
    console.log(
      "🚀 ~ file: compareAndChange.js:104 ~ futureProductsLibrary:",
      futureProductsLibrary
    );
    const currentProductsLibrary = current["productsLibrary"];
    console.log(
      "🚀 ~ file: compareAndChange.js:106 ~ currentProductsLibrary:",
      currentProductsLibrary
    );
    new Promise((resolve, reject) => {
      updateCountries({
        client,
        current: currentProductsLibrary,
        future: futureProductsLibrary,
        index: "productsLibrary",
      });
      resolve();
    }).then(() => console.log("hbdbh"));

    // for (const collectionName of Object.keys(futureProductsLibrary)) {
    //   const collection = futureProductsLibrary[collectionName];
    //   for (const index of collection) {
    //     const { key, ...rest } = index;
    //     const indexToBeDelete = currentProductsLibrary[collectionName].find(
    //       (index) => index.name === rest.name
    //     );
    //     if (!indexToBeDelete) {
    //       console.log(
    //         "🚀 ~ file: updateCountries.js:12 ~ exports.updateCountries= ~ indexToBeDelete:",
    //         indexToBeDelete
    //       );

    //       //   for (const country of countries) {
    //       await client
    //         .db("productsLibrary")
    //         .collection(collectionName)
    //         .dropIndex(rest.name);
    //       //   }
    //     }
    //   }
    // }
    // for (const collectionName of Object.keys(currentProductsLibrary)) {
    //   const collection = currentProductsLibrary[collectionName];
    //   for (const index of collection) {
    //     // for (const country of countries) {
    //     const { key, ...rest } = index;
    //     // console.log(
    //     //   "🚀 ~ file: addNewCountry.js:27 ~ collection.forEach ~ rest:",
    //     //   rest
    //     // );
    //     await client
    //       .db("productsLibrary")
    //       .collection(collectionName)
    //       .createIndex(key, { ...rest });
    //     // }
    //   }
    // }
  } catch (error) {
    await client.close();
  }
  //   await client.close();
})();
