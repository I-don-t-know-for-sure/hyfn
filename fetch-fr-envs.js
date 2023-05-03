#! /usr/bin/env node
import cp from "child_process";

import fs from "fs";
(function () {
  const envs = ["development", "staging", "production"];
  var result = {};
  for (const env of envs) {
    const cmd = cp.spawn(
      `aws ssm get-parameters-by-path --region eu-south-1 --with-decryption --path /hyfn/frontend/${env}`,
      { shell: true }
    );

    cmd.on("spawn", () => console.log("Running build command for:"));
    cmd.stdout.on("data", (d) => {
      const parameters = JSON.parse(d).Parameters;
      console.log(
        "🚀 ~ file: fetch-envs.js:31 ~ cmd.stdout.on ~ parameters:",
        parameters
      );
      result = parameters.reduce((accu, parameter) => {
        const parameterNameList = parameter.Name.split("/");
        const parameterName = `${
          parameterNameList[parameterNameList.length - 1]
        }`;

        return {
          ...accu,
          [env]: {
            ...accu[env],
            [parameterName]: parameter.Value,
          },
        };
      }, result);
      console.log(
        "🚀 ~ file: fetch-envs.js:45 ~ result=parameters.reduce ~ result:",
        result
      );
    });

    cmd.stderr.on("data", (d) =>
      console.log(` onebhbdch22222 ${d.Parameters}`)
    );
    cmd.on("exit", async () => {
      fs.writeFile(
        `frEnvVaraibles.ts`,
        `export const frConfig = ${JSON.stringify(result)}`,
        function (err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );

      console.log("Build Completed");
    });
  }
})();
