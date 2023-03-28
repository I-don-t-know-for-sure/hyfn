const { getDatabaseIndexes } = require("./getDatabaseIndexes");
const { getMongodbClient } = require("./getMongodbClient");

(async () => {
  const env = process.argv[2] || "development";
  const client = await getMongodbClient(env);
  await client.connect();
  try {
    const fileSystem = require("fs");

    const fs = fileSystem.promises;
    const dir = "./src/constents";
    if (!fileSystem.existsSync(dir)) {
      await fileSystem.mkdirSync(dir);
    }

    let databaseIndexes = await getDatabaseIndexes(client);

    let previousIndexes = [];
    try {
      previousIndexes = JSON.parse(
        await (
          await fs.readFile(`./src/constents/DatabaseIndexesHistory.json`)
        ).toString()
      );
    } catch (error) {
      previousIndexes = [];
    }

    const newIndexes = [...previousIndexes, databaseIndexes];

    await fs.writeFile(
      `./src/constents/currentDatabaseIndexes.json`,
      JSON.stringify(databaseIndexes, undefined, 2)
    );
    await fs.writeFile(
      `./src/constents/DatabaseIndexesHistory.json`,
      JSON.stringify(newIndexes, undefined, 2)
    );
  } catch (error) {
    await client.close();
  }
  await client.close();
  return;
})();
