const fs = require("fs");
const path = require("path");
(async () => {
  const dir = process.argv[2];
  // function to recursively loop through directories and files
  function traverseDir(dir) {
    // get all files and directories inside the current directory
    const files = fs.readdirSync(dir);

    // loop through all files and directories
    files.forEach((file) => {
      // get the full path of the file/directory
      const filePath = path.join(dir, file);

      // check if the file is a directory
      const isDirectory = fs.statSync(filePath).isDirectory();

      // exclude directories that start with a dot or are named ".sst"
      if (isDirectory && (file.startsWith(".") || file === ".sst")) {
        return;
      }

      // if it's a directory, call the function recursively to loop through its contents
      if (isDirectory) {
        if (file === "lambdas") {
          console.log(`Directory: ${filePath}`);
          traverseDir(filePath);
        } else {
          traverseDir(filePath);
        }
      } else {
        // if it's a TypeScript file inside "lambdas", add an interface and export the mainFunction
        if (
          path.dirname(filePath).includes("/lambdas") &&
          path.extname(filePath) === ".ts"
        ) {
          const fileName = path.basename(filePath, ".ts");
          function addInterfaceToTSFile(filePath) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const fileName = path.basename(filePath, ".ts");
            const interfaceName = `${fileName
              .charAt(0)
              .toUpperCase()}${fileName.slice(1)}Props`;

            const interfaceDeclaration = `interface ${interfaceName} extends Omit<MainFunctionProps, "arg"> {\n  // Add your interface properties here\n}\n`;

            const modifiedFileContent = `${interfaceDeclaration}${fileContent}`;

            fs.writeFileSync(filePath, modifiedFileContent);
          }
          addInterfaceToTSFile(filePath);
          // const fileName = path.basename(filePath, ".ts");
          // const interfaceName =
          //   fileName.charAt(0).toUpperCase() + fileName.slice(1) + "Props";
          // const interfaceDefinition = `interface ${interfaceName} extends Omit<MainFunctionProps, 'arg'> {\n  // add your interface properties here\n}\n`;
          // let fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
          // fileContent = fileContent.replace(
          //   /(\/\/<interfaces>)([\s\S]*)(\/\/<\/interfaces>)/gm,
          //   `$1\n${interfaceDefinition}$3`
          // );

          // // find and modify mainFunction
          // const functionRegex =
          //   /(export\s+)?const\s+mainFunction\s*=\s*async\s*<T>?\([\s\S]*?\)\s*=>\s*[\s\S]*?;/gm;
          // let match = functionRegex.exec(fileContent);
          // if (match !== null) {
          //   // replace function name with file name
          //   const functionName =
          //     fileName.charAt(0).toLowerCase() + fileName.slice(1);
          //   fileContent = fileContent.replace(
          //     match[0],
          //     `const ${functionName}${match[1]}`
          //   );
          //   // add export statement
          //   fileContent += `\n\nexport { ${functionName} };`;
          //   fs.writeFileSync(filePath, fileContent);
          //   console.log(`Modified ${filePath}`);
          // } else {
          //   console.log(`No async mainFunction found in ${filePath}`);
          // }
        }
      }
    });
  }
  traverseDir(dir);
})();
