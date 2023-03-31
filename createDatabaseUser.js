#! /usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import { config } from "./envVaraibles.js";
import { getStage } from "./stacks/getStage.js";
(async function () {
  const stage = getStage(process.argv[2]);

  if (`${stage}` in config) {
    throw new Error();
  }
  const { groupId } = config[stage];
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
  // const databaseUser = await new Promise(function (resolve, reject) {
  //   exec(
  //     `curl --user "${publicKey}:${privateKey}" --digest \
  //     --header "Accept: application/json" \
  //     --header "Content-Type: application/json" \
  //     --include \
  //     --request POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/${groupId}/databaseUsers" \
  //     --data '{

  //         "databaseName": "$external",
  //         "awsIAMType": "ROLE",
  //         "roles": [{ "databaseName": "admin", "roleName": "readWriteAnyDatabase"}],

  //           "username": "${arn}"
  //       }'`,
  //     (err, stdout, stderr) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve({ stdout, stderr });
  //       }
  //     }
  //   );
  // });

  // console.log(
  //   "🚀 ~ file: createDatabaseUser.js:55 ~ databaseUser ~ databaseUser",
  //   databaseUser
  // );
})();
