import { MongoClient } from "mongodb";
declare var URL: any;

let client: MongoClient | null = null;

// IAM Role ARN that we created earlier and added to MongoDB Atlas

const CLUSTER_NAME = process.env.MONGODB_CLUSTER_NAME; // e.g. cluster-name.asdf
console.log(process.env);
/**
 * Instantiates a {@link MongoClient} if one doesn't already exist.
 * We cache it to limit the number of open connections.
 *
 * Requires environment variable `MONGODB_ACCESS_ROLE_ARN` which references an IAM role ARN.
 * The Resource will need permissions to assume this role.
 */

const {
  AWS_ACCESS_KEY_ID,

  AWS_SECRET_ACCESS_KEY,

  AWS_SESSION_TOKEN,
} = process.env as {
  AWS_ACCESS_KEY_ID: string;

  AWS_SECRET_ACCESS_KEY: string;

  AWS_SESSION_TOKEN: string;
};
const encodedSecretKey = encodeURIComponent(AWS_SECRET_ACCESS_KEY);
const combo = `${AWS_ACCESS_KEY_ID}:${encodedSecretKey}`;
const url = new URL(`mongodb+srv://${combo}@${CLUSTER_NAME}.mongodb.net`);
url.searchParams.set("authSource", "$external");
url.searchParams.set(
  "authMechanismProperties",
  `AWS_SESSION_TOKEN:${AWS_SESSION_TOKEN}`
);
url.searchParams.set("w", "majority");
url.searchParams.set("retryWrites", "true");
url.searchParams.set("authMechanism", "MONGODB-AWS");

export const getMongoClientWithIAMRole = async () => {
  console.log("Getting mongo client");
  if (client) {
    client = await MongoClient.connect(url.toString());
    console.log("Returning mongo client in cache");
    return client;
  }

  // Create connection string
  console.log("here");
  const mongoClient = new MongoClient(url.toString());
  client = await mongoClient.connect();

  console.log("Successfully connected to mongo db, returning mongo client");
  return client;
};
