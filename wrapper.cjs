const { spawn } = require("child_process");
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const { isColorSupported, green } = require("colorette");
(async () => {
  const command = process.argv.slice(2).join(" ");
  const commandTool = command[0];
  const options = command.slice(1);
  console.log("🚀 ~ file: wrapper.cjs:9 ~ options:", commandTool, options);

  const outputFile = "../../output.txt";

  const child = spawn(command, { shell: true });

  child.stderr.pipe(process.stderr);

  child.stdout.pipe(fs.createWriteStream(outputFile));

  child.on("error", (err) => {
    console.error(err);
  });
})();
