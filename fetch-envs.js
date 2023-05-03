#! /usr/bin/env node
import cp from "child_process";

import fs from "fs";
(function () {
  const envs = ["development", "staging", "production", ""];
  var result = {};

  for (const env of envs) {
    const cmd = cp.spawn(
      `aws ssm get-parameters-by-path --region eu-south-1 --with-decryption  --path /hyfn/backend${
        env === "" ? "" : "/" + env
      } --query 'Parameters[*].{Name:Name, Value:Value}' `,
      { shell: true }
    );

    cmd.stdout.on("data", (d) => {
      console.log(
        "🚀 ~ file: fetch-envs.js:34 ~ cmd.stdout.on ~ d:",
        d.toString()
      );

      const parameters = JSON.parse(d.toString());

      result = parameters.reduce((accu, parameter) => {
        const parameterNameList = parameter.Name.split("/");
        const parameterName = `${
          parameterNameList[parameterNameList.length - 1]
        }`;
        const value =
          parameterName === "firebaseAdminSDK-private_key"
            ? parameter.Value.replace(/\\n/g, "\n")
            : parameter.Value;

        return {
          ...accu,
          [env]: {
            ...accu[env],
            [parameterName]: value,
          },
        };
      }, result);
    });

    cmd.stderr.on("data", (d) =>
      console.log(` onebhbdch22222 ${d.Parameters}`)
    );
    cmd.on("exit", async () => {
      console.log(result);
      fs.writeFile(
        `envVaraibles.ts`,
        `export const config = ${JSON.stringify(result)}`,
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
      const envString = Object.entries(result)
        .map(([stage]) => {
          return Object.entries(result[stage])
            .map(([key, value]) => `${stage}${key}=${value}`)
            .join("\n");
        })
        .join("\n");

      // Write the formatted string to the .env file
      fs.writeFileSync(".env", envString);
      // await after({ env, fs, cp })
    });
  }

  //   })
})();
