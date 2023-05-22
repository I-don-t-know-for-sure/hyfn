const { resolve } = require("path");
const { getDatabaseIndexes } = require("./getDatabaseIndexes");
const { getMongodbClient } = require("./getMongodbClient");
const { updateCountries } = require("./updateCountries");

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

    const futureGeneralData = future["generalData"];

    const currentGeneralData = current["generalData"];

    const myPromise = new Promise((resolve, reject) => {
      updateCountries({
        client,
        current: currentGeneralData,
        future: futureGeneralData,
        index: "generalData",
      });
      resolve();
    }).then((data) => data);

    const currentCountryIndexes = current["base"];

    const futureCountryIndexes = future["base"];

    await updateCountries({
      client,
      current: currentCountryIndexes,
      future: futureCountryIndexes,
      index: "base",
    });
    const futureProductsLibrary = future["productsLibrary"];

    const currentProductsLibrary = current["productsLibrary"];

    new Promise((resolve, reject) => {
      updateCountries({
        client,
        current: currentProductsLibrary,
        future: futureProductsLibrary,
        index: "productsLibrary",
      });
      resolve();
    }).then((data) => data);
  } catch (error) {
    await client.close();
  }
  //   await client.close();
})();
