#! /usr/bin/env node

const { load } = require('js-yaml');
const { exec } = require('child_process');
const { readFileSync } = require('fs');

(async function () {
  const env = process.argv[2];

  const data = readFileSync(`./.env.${env}`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    return data;
  });
  console.log('🚀 ~ file: createDatabaseUser.js:10 ~ data', data);
  console.log(data);
  const appEnvs = data.split('\n').map((variable) => {
    const varArray = variable.split('=');
    return { [varArray[0]]: varArray[1] };
  });
  console.log('🚀 ~ file: createDatabaseUser.js:22 ~ appEnvs ~ appEnvs', appEnvs);
  const groupId = appEnvs.find((env) => !!env.groupId).groupId;
  const privateKey = appEnvs.find((env) => !!env.mongoPrivetKey).mongoPrivetKey;
  const publicKey = appEnvs.find((env) => !!env.mongoPublicKey).mongoPublicKey;
  console.log('🚀 ~ file: createDatabaseUser.js:24 ~ groupId', groupId);

  const result = await new Promise(function (resolve, reject) {
    exec(`serverless info --stage ${env}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

  console.log('🚀 ~ file: createDatabaseUser.js:10 ~ result ~ result');
  const stackInfo = load(result?.stdout?.toString());
  console.log('🚀 ~ file: createDatabaseUser.js:25 ~ stackInfo', stackInfo);
  const stackName = stackInfo.service;
  const endpoints = stackInfo.endpoints
    .split(' - ')
    .join(',')
    .split(' ')
    .map((endpoint) => {
      const endpointArray = endpoint.split(',');
      return { [endpointArray[0]]: endpointArray[1] };
    });
  console.log('🚀 ~ file: createDatabaseUser.js:28 ~ endpoints', endpoints);
  const endpointArray = endpoints[0].POST.split('/');
  endpointArray.pop();
  const gatewayURL = endpointArray.join(',').replaceAll(',', '/');
  console.log('🚀 ~ file: createDatabaseUser.js:37 ~ gatewayURL', gatewayURL);
  console.log('🚀 ~ file: createDatabaseUser.js:26 ~ stackName', stackName);

  const awsResult = await new Promise(function (resolve, reject) {
    exec(
      `aws cloudformation list-stack-resources --stack-name ${stackName}-${env} --query "StackResourceSummaries[?ResourceType=='AWS::IAM::Role'].{LogicalResourceId: LogicalResourceId, PhysicalResourceId: PhysicalResourceId, LastUpdate: LastUpdatedTimestamp}"`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
  console.log('🚀 ~ file: createDatabaseUser.js:27 ~ awsResult ~ awsResult', awsResult.stdout);
  const lambdaRoleName = JSON.parse(awsResult?.stdout)[0].PhysicalResourceId;
  console.log('🚀 ~ file: createDatabaseUser.js:40 ~ lambdaRoleName', lambdaRoleName);
  const awsArn = await new Promise(function (resolve, reject) {
    exec(`aws iam get-role --role-name ${lambdaRoleName}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });

  // const groupId = '623a340f78c43008551c164f';
  const arn = JSON.parse(awsArn.stdout).Role.Arn;
  console.log('🚀 ~ file: createDatabaseUser.js:52 ~ arn', arn);
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

  console.log('🚀 ~ file: createDatabaseUser.js:55 ~ databaseUser ~ databaseUser', databaseUser);

  const awsSSMResult = await new Promise(function (resolve, reject) {
    exec(
      `aws ssm put-parameter \
      --name "/hyfn/frontend/${env}/driver-management/BASE_URL" \
      --value "${gatewayURL}" \
      --type "SecureString" \
      --overwrite`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      }
    );
  });
  console.log('🚀 ~ file: createDatabaseUser.js:44 ~ awsResult ~ awsResult', awsSSMResult);
})();
