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
  let roleARN = process.argv[3];
  ///////////////////////////
  const data = fs.readFileSync(`./.env`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    return data;
  });

  const appEnvs = data.split("\n").map((variable) => {
    const varArray = variable.split("=");
    return { [varArray[0]]: varArray[1] };
  });

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
  if (!roleARN) {
    roleARN = await new Promise(function (resolve, reject) {
      fs.readFile("output.txt", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        const lines = data.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith("apiFunctionsRoleArn")) {
            const value = line.substring(line.indexOf("=") + 1).trim();
            resolve(value.replace("apiFunctionsRoleArn:", "").trim());
          }
        }
      });
    });
  }

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

            "username": "${roleARN}"
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
