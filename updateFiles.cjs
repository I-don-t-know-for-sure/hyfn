const fs = require("fs");
const path = require("path");
const ts = require("typescript");
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
          // const deleteMainFunction = (filePath) => {
          //   // Read the file content
          //   const fileContent = fs.readFileSync(filePath, "utf-8");

          //   // Parse the file content as a TypeScript AST
          //   const sourceFile = ts.createSourceFile(
          //     filePath,
          //     fileContent,
          //     ts.ScriptTarget.Latest,
          //     true
          //   );

          //   // Find the const async arrow function called "mainFunction" inside "handler"
          //   let mainFunctionNode;
          //   ts.forEachChild(sourceFile, function findMainFunction(node) {
          //     if (
          //       ts.isVariableDeclaration(node) &&
          //       ts.isIdentifier(node.name) &&
          //       node.name.text === "handler"
          //     ) {
          //       const initializer = node.initializer;
          //       if (
          //         initializer &&
          //         ts.isArrowFunction(initializer) &&
          //         ts.isBlock(initializer.body)
          //       ) {
          //         ts.forEachChild(initializer.body, function findMain(node) {
          //           if (
          //             ts.isVariableDeclaration(node) &&
          //             ts.isIdentifier(node.name) &&
          //             node.name.text === "mainFunction"
          //           ) {
          //             mainFunctionNode = node;
          //           }
          //           ts.forEachChild(node, findMain);
          //         });
          //       }
          //     }
          //     ts.forEachChild(node, findMainFunction);
          //   });

          //   if (!mainFunctionNode) {
          //     // throw new Error("Cannot find mainFunction inside handler");
          //     return;
          //   }

          //   // Remove the mainFunction node from the AST
          //   const result = ts.transform(sourceFile, [
          //     (context) => {
          //       const visit = (node) => {
          //         if (node === mainFunctionNode) {
          //           return ts.createNotEmittedStatement(node);
          //         }
          //         return ts.visitEachChild(node, visit, context);
          //       };
          //       return (node) => ts.visitNode(node, visit);
          //     },
          //   ]);
          //   const transformedSourceFile = result.transformed[0];

          //   // Print the updated AST
          //   const printer = ts.createPrinter();
          //   const updatedFileContent = printer.printFile(transformedSourceFile);

          //   // Write the modified file content back to the file
          //   fs.writeFileSync(filePath, updatedFileContent);
          // };
          // deleteMainFunction(filePath);

          // function extractAndExportMainFunction(filePath) {
          //   // Read the file content
          //   const fileContent = fs.readFileSync(filePath, "utf-8");

          //   // Parse the file content as a TypeScript AST
          //   const sourceFile = ts.createSourceFile(
          //     filePath,
          //     fileContent,
          //     ts.ScriptTarget.Latest,
          //     true
          //   );

          //   // Find the const async arrow function called "mainFunction"
          //   let mainFunctionNode;
          //   ts.forEachChild(sourceFile, function findMainFunction(node) {
          //     if (
          //       ts.isVariableDeclaration(node) &&
          //       ts.isIdentifier(node.name) &&
          //       node.name.text === "handler"
          //     ) {
          //       const initializer = node.initializer;
          //       if (
          //         initializer &&
          //         ts.isArrowFunction(initializer) &&
          //         ts.isBlock(initializer.body)
          //       ) {
          //         ts.forEachChild(initializer.body, function findMain(node) {
          //           if (
          //             ts.isVariableDeclaration(node) &&
          //             ts.isIdentifier(node.name) &&
          //             node.name.text === "mainFunction"
          //           ) {
          //             const mainFunctionInitializer = node.initializer;
          //             if (
          //               mainFunctionInitializer &&
          //               ts.isArrowFunction(mainFunctionInitializer) &&
          //               ts.isBlock(mainFunctionInitializer.body)
          //             ) {
          //               mainFunctionNode = node;
          //             }
          //           }
          //           ts.forEachChild(node, findMain);
          //         });
          //       }
          //     }
          //     ts.forEachChild(node, findMainFunction);
          //   });

          //   if (!mainFunctionNode) {
          //     // throw new Error("Cannot find mainFunction inside handler");
          //     return;
          //   }

          //   // Get the new name for the mainFunction based on the file name
          //   const fileName = path.basename(filePath, ".ts");
          //   const newMainFunctionName = `${fileName
          //     .charAt(0)
          //     .toLowerCase()}${fileName.slice(1)}Handler`;

          //   // Replace all references to the mainFunction with the new name
          //   const printer = ts.createPrinter();
          //   const modifiedFileContent = printer.printNode(
          //     ts.EmitHint.Unspecified,
          //     sourceFile,
          //     sourceFile
          //   );
          //   const regex = new RegExp(
          //     `\\b${mainFunctionNode.name.text}\\b`,
          //     "g"
          //   );
          //   const updatedModifiedFileContent = modifiedFileContent.replace(
          //     regex,
          //     `mainFunction: ${newMainFunctionName}`
          //   );

          //   // Add the mainFunction declaration with the new name to the beginning of the file
          //   const mainFunctionDeclaration = fileContent.substring(
          //     mainFunctionNode.pos,
          //     mainFunctionNode.end
          //   );
          //   const updatedMainFunctionDeclaration =
          //     mainFunctionDeclaration.replace(
          //       mainFunctionNode.name.text,
          //       newMainFunctionName
          //     );
          //   const updatedFileContent = `export const ${updatedMainFunctionDeclaration};\n${updatedModifiedFileContent}`;

          //   // Write the modified file content back to the file
          //   fs.writeFileSync(filePath, updatedFileContent);
          // }
          // extractAndExportMainFunction(filePath);
          const filename = path.basename(filePath, ".ts");

          const updateInterface = (filePath) => {
            // Get the file name without the extension
            const fileName = path.basename(filePath, ".ts");
            const upperCaseFileName =
              fileName.charAt(0).toUpperCase() + fileName.slice(1);

            // Read the file content
            const fileContent = fs.readFileSync(filePath, "utf-8");

            // Parse the file content as a TypeScript AST
            const sourceFile = ts.createSourceFile(
              filePath,
              fileContent,
              ts.ScriptTarget.Latest,
              true
            );

            // Find the interface with the correct name
            let interfaceNode;
            ts.forEachChild(sourceFile, function findInterface(node) {
              if (
                ts.isInterfaceDeclaration(node) &&
                ts.isIdentifier(node.name) &&
                node.name.text === `${upperCaseFileName}Props`
              ) {
                interfaceNode = node;
              }
              ts.forEachChild(node, findInterface);
            });

            if (!interfaceNode) {
              return;
            }

            // Add the "arg: any" field to the interface
            const updatedInterface = ts.factory.updateInterfaceDeclaration(
              interfaceNode,
              interfaceNode.decorators,
              interfaceNode.modifiers,
              interfaceNode.name,
              interfaceNode.typeParameters,
              interfaceNode.heritageClauses,
              [
                ...interfaceNode.members,
                ts.factory.createPropertySignature(
                  undefined,
                  ts.factory.createIdentifier("arg"),
                  undefined,
                  ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                  undefined
                ),
              ]
            );

            // Replace the old interface with the updated one
            const result = ts.transform(sourceFile, [
              (context) => {
                const visit = (node) => {
                  if (node === interfaceNode) {
                    return updatedInterface;
                  }
                  return ts.visitEachChild(node, visit, context);
                };
                return (node) => ts.visitNode(node, visit);
              },
            ]);
            const transformedSourceFile = result.transformed[0];

            // Print the updated AST
            const printer = ts.createPrinter();
            const updatedFileContent = printer.printFile(transformedSourceFile);

            // Write the modified file content back to the file
            fs.writeFileSync(filePath, updatedFileContent);
          };
          updateInterface(filePath);
        }
      }
    });
  }
  traverseDir(dir);
})();
