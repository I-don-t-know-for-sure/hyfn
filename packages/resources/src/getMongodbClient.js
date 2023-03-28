exports.getMongodbClient = async (env) => {
  const fileSystem = require("fs");

  const fs = fileSystem.promises;
  const data = await fs.readFile(`./.env.${env}`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    return data;
  });

  const appEnvs = data.split("\n").map((variable) => {
    const varArray = variable.split(" = ");
    return { [varArray[0]]: varArray[1] };
  });
  const uri = appEnvs.find((env) => !!env.dburi).dburi;

  const { MongoClient, ServerApiVersion } = require("mongodb");
  //   const uri =
  //     "mongodb+srv://shopping-cart:shopping-cart@realmcluster.rjuzy.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  return client;
};
