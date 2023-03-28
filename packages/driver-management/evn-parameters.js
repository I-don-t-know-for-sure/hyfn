#! /usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-extra-semi
import cp from 'child_process'
import fs from 'fs'
import buildInfo from './amplify/.config/local-env-info.json' assert { type: "json" };
(function () {
  // bring in child_process to use spawn command
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef

  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef

  // bring in the amplify local-env-info.json to see current environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef

  // spawn the build command based on the env name:
  // npm run build-production on prod or npm run build-staging on staging
  const env = buildInfo.envName === "dev" ? "development" : buildInfo.envName;

  const cmd = cp.spawn(
    `aws ssm get-parameters-by-path --with-decryption --path /hyfn/frontend/${env}`,
    { shell: true }
  );
  // const cmd2 = cp.spawn(
  //   `aws ssm get-parameters-by-path --with-decryption --path /hyfn/frontend/${env}/delivery-driver/BASE_URL`,
  //   { shell: true },
  // )
  //   const cmd = cp.spawn(
  //     `aws ssm get-parameters-by-path --with-decryption --path /hyfn/delivery-driver/${buildInfo.envName}`,
  //     { shell: true },
  //   )
  // echo output of the commands to the console
  // const ready = []
  var result =
    buildInfo.envName === "dev"
      ? "GENERATE_SOURCEMAP=false"
      : "GENERATE_SOURCEMAP=false";
  cmd.on("spawn", () =>
    console.log("Running build command for:", buildInfo.envName)
  );
  cmd.stdout.on("data", (d) => {
    const parameters = JSON.parse(d).Parameters;
    result = parameters.reduce((accu, parameter) => {
      const parameterNameList = parameter.Name.split("/");
      const parameterName = `VITE_APP_${
        parameterNameList[parameterNameList.length - 1]
      }`;

      return accu + "\n" + `${parameterName}=${parameter.Value}`;
    }, result);
    fs.writeFile(`.env.${env}`, result, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  });

  // if (ready.length === 2)
  //   fs.writeFile(`.env.${env}.txt`, result, function (err) {
  //     if (err) throw err
  //     console.log('Saved!')
  //   })
  cmd.stderr.on("data", (d) => console.log(` onebhbdch22222 ${d.Parameters}`));
  cmd.on("exit", async () => {
    await after({ env, fs, cp });
    console.log("Build Completed");
  });
})();
// aws ssm get-parameters-by-path --with-decryption --path /myapp/production
const after = async ({ cp, env, fs }) => {
  const cmd2 = cp.spawn(
    `aws ssm get-parameters-by-path --with-decryption --path /hyfn/frontend/${env}/driver-management`,
    { shell: true }
  );
  cmd2.stdout.on("data", (d) => {
    const parameters = JSON.parse(d).Parameters;
    console.log(
      "🚀 ~ file: evn-parameters.js:62 ~ cmd2.stdout.on ~ parameters",
      parameters
    );
    const result = parameters.reduce((accu, parameter) => {
      const parameterNameList = parameter.Name.split("/");
      const parameterName = `VITE_APP_${
        parameterNameList[parameterNameList.length - 1]
      }`;

      return accu + "\n" + `${parameterName}=${parameter.Value}`;
    }, "");

    fs.appendFile(`.env.${env}`, result, function (err) {
      if (err) throw err;
      console.log("Saved!");
    });
  });
};
