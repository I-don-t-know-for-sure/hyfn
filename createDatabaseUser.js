#! /usr/bin/env node

import { exec } from "child_process";
import fs from "fs";

const getStage = (stage) => {
  if (stage === "development") {
    return "development";
  }
  if (stage === "staging") {
    return "staging";
  }
  if (stage === "production") {
    return "production";
  }
  return "development";
};

(async function () {
  const stage = getStage(process.argv[2]);

  ///////////////////////////
  const data = fs.readFileSync(`./.env`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // console.log(data);
    return data;
  });
  // console.log("🚀 ~ file: createDatabaseUser.js:10 ~ data", data);
  // console.log(data);
  const appEnvs = data.split("\n").map((variable) => {
    const varArray = variable.split("=");
    return { [varArray[0]]: varArray[1] };
  });
  console.log(
    "🚀 ~ file: createDatabaseUser.js:22 ~ appEnvs ~ appEnvs",
    appEnvs
  );
  const groupId = appEnvs.find((env) => !!env[`${stage}groupId`])[
    `${stage}groupId`
  ];
  const privateKey = appEnvs.find((env) => !!env[`${stage}mongoPrivetKey`])[
    `${stage}mongoPrivetKey`
  ];
  const publicKey = appEnvs.find((env) => !!env[`${stage}mongoPublicKey`])[
    `${stage}mongoPublicKey`
  ];
  ////////////////////////////
  console.log("🚀 ~ file: createDatabaseUser.js:45 ~ groupId:", groupId);
  console.log("🚀 ~ file: createDatabaseUser.js:46 ~ privateKey:", privateKey);
  console.log("🚀 ~ file: createDatabaseUser.js:49 ~ publicKey:", publicKey);

  var arn = "";
  fs.readFile("output.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const regex = /apiFunctionsRoleArn:\s*(.*)/;
    const match = regex.exec(data.replace(/\n/g, " "));

    if (match && match[1]) {
      console.log(match[1]);
      arn = match[1];
    } else {
      throw new Error("not found");
    }
  });

  console.log("🚀 ~ file: createDatabaseUser.js:52 ~ arn", arn);
  const databaseUser = await new Promise(function (resolve, reject) {
    exec(
      `curl --user "${publicKey}:${privateKey}" --digest \
      --header "Accept: application/json" \
      --header "Content-Type: application/json" \
      --include \
      --request POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/databaseUsers" \
      --data '{

          "databaseName": "$external",
          "awsIAMType": "ROLE",
          "roles": [{ "databaseName": "admin", "roleName": "readWriteAnyDatabase"}],

            "username": "${arn}"
        }'`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });

  console.log(
    "🚀 ~ file: createDatabaseUser.js:55 ~ databaseUser ~ databaseUser",
    databaseUser
  );
})();
