const { spawn } = require("child_process");
const chalk = require("chalk");
const fs = require("fs");
const util = require("util");
const { isColorSupported, green } = require("colorette");
(async () => {
  // Define the command to execute
  const command = process.argv.slice(2).join(" ");
  const commandTool = command[0];
  const options = command.slice(1);
  console.log("🚀 ~ file: wrapper.cjs:9 ~ options:", commandTool, options);
  // Define the file to write the output to
  const outputFile = "../../output.txt";

  // Execute the command and log the output to the console
  const child = spawn(command, { shell: true });
  // child.stdout.pipe(process.stdout);
  // child.stderr.pipe(process.stderr);
  child.stdout.on("data", (data) => {
    // const output = data.toString();
    // const colorRegex = /\x1b\[(\d+)m/g;
    // const hasColors = colorRegex.test(output);
    // console.log(`Output has colors: ${hasColors}`);

    // // Log the output with escape codes visible for inspection
    // console.log(util.inspect(output, { colors: true }));

    console.log(green(data.toString()));
  });

  child.stderr.pipe(process.stderr);

  // Write the output to a file

  // Write the output to a file
  child.stdout.pipe(fs.createWriteStream(outputFile));
  // Log any errors from the child process
  child.on("error", (err) => {
    console.error(err);
  });
})();
