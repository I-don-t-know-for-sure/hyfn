#! /usr/bin/env node

(function () {
  // bring in child_process to use spawn command

  const cp = require('child_process');

  const fs = require('fs');
  // bring in the amplify local-env-info.json to see current environment

  // const buildInfo = require('./amplify/.config/local-env-info.json')
  // spawn the build command based on the env name:
  // npm run build-production on prod or npm run build-staging on staging
  const env = process.argv[2];

  const cmd = cp.spawn(
    `aws ssm get-parameters-by-path --with-decryption --path /hyfn/backend/${env}`,
    { shell: true }
  );

  //   const cmd = cp.spawn(
  //     `aws ssm get-parameters-by-path --with-decryption --path /hyfn/delivery-driver/${buildInfo.envName}`,
  //     { shell: true },
  //   )
  // echo output of the commands to the console

  var result = '';
  cmd.on('spawn', () => console.log('Running build command for:'));
  cmd.stdout.on('data', (d) => {
    const parameters = JSON.parse(d).Parameters;
    result = parameters.reduce((accu, parameter) => {
      const parameterNameList = parameter.Name.split('/');
      const parameterName = `${parameterNameList[parameterNameList.length - 1]}`;

      return accu + '\n' + `${parameterName}=${parameter.Value}`;
    }, result);
    fs.writeFile(`.env.${env}`, result, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  });

  // if (ready.length === 2)
  //   fs.writeFile(`.env.${env}.txt`, result, function (err) {
  //     if (err) throw err
  //     console.log('Saved!')
  //   })
  cmd.stderr.on('data', (d) => console.log(` onebhbdch22222 ${d.Parameters}`));
  cmd.on('exit', async () => {
    // await after({ env, fs, cp })
    console.log('Build Completed');
  });
})();
// aws ssm get-parameters-by-path --with-decryption --path /myapp/production
// const after = async ({ cp, env, fs }) => {
//   const cmd2 = cp.spawn(
//     `aws ssm get-parameters-by-path --with-decryption --path /hyfn/backend/${env}/delivery-driver`,
//     { shell: true },
//   )
//   cmd2.stdout.on('data', (d) => {
//     const parameters = JSON.parse(d).Parameters
//     console.log('🚀 ~ file: evn-parameters.js:62 ~ cmd2.stdout.on ~ parameters', parameters)
//     const result = parameters.reduce((accu, parameter) => {
//       const parameterNameList = parameter.Name.split('/')
//       const parameterName = `VITE_APP_${parameterNameList[parameterNameList.length - 1]}`

//       return accu + '\n' + `${parameterName}=${parameter.Value}`
//     }, '')

//     fs.appendFile(`.env.${env}`, result, function (err) {
//       if (err) throw err
//       console.log('Saved!')
//     })
//   })
// }
