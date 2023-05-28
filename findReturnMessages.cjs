/* const fs = require("fs");
const path = require("path");
const pathToDir = process.argv[2];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== "node_modules") {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

(() => {
  // Example usage:
  const files = getAllFiles(pathToDir);

  const translations = {};

  files.forEach((filepath) => {
    if (!filepath.includes(`/${"lambdas"}/`)) {
      return;
    }
    let fileContent = fs.readFileSync(filepath, "utf8");

    // Find strings after return statements
    const returnRegex = /return\s+(['"])(.*?)\1/g;
    let returnMatches;
    while ((returnMatches = returnRegex.exec(fileContent)) !== null) {
      const key = returnMatches[2];
      if (!(key in translations)) {
        const variableName = generateVariableName(key);
        translations[variableName] = key;
        fileContent = fileContent.replace(
          returnMatches[0],
          `return returnsObj.${variableName}`
        );
      }
    }

    // Find strings inside Error objects
    const errorRegex = /new Error\((['"])(.*?)\1\)/g;
    let errorMatches;
    while ((errorMatches = errorRegex.exec(fileContent)) !== null) {
      const key = errorMatches[2];
      if (!(key in translations)) {
        const variableName = generateVariableName(key);
        translations[variableName] = key;
        fileContent = fileContent.replace(
          errorMatches[0],
          `new Error(returnsObj.${variableName})`
        );
      }
    }

    fs.writeFileSync(filepath, fileContent);
  });

  fs.writeFileSync("results.json", JSON.stringify(translations, null, 2));
  console.log("Translation keys extracted and saved to 'results.json'");
})();

function generateVariableName(key) {
  const words = key.split(/\s+/);
  const capitalizedWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join("");
}
 */

const fs = require("fs").promises;
const path = require("path");
const pathToDir = process.argv[2];

async function getAllFiles(dirPath, arrayOfFiles) {
  const files = await fs.readdir(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      if (file !== "node_modules") {
        arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

(async () => {
  const files = await getAllFiles(pathToDir);

  const translations = {};

  for (const filepath of files) {
    if (!filepath.includes(`/${"lambdas"}/`)) {
      continue;
    }

    let fileContent;
    try {
      fileContent = await fs.readFile(filepath, "utf8");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

    // Find strings after return statements
    const returnRegex = /return\s+(['"])(.*?)\1/g;
    let returnMatches;
    while ((returnMatches = returnRegex.exec(fileContent)) !== null) {
      const key = returnMatches[2];
      if (!(key in translations)) {
        const variableName = generateVariableName(key);
        translations[variableName] = key;
        fileContent = fileContent.replace(
          returnMatches[0],
          `return returnsObj.${variableName}`
        );
      }
    }

    // Find strings inside Error objects
    const errorRegex = /new Error\((['"])(.*?)\1\)/g;
    let errorMatches;
    while ((errorMatches = errorRegex.exec(fileContent)) !== null) {
      const key = errorMatches[2];
      if (!(key in translations)) {
        const variableName = generateVariableName(key);
        translations[variableName] = key;
        fileContent = fileContent.replace(
          errorMatches[0],
          `new Error(returnsObj.${variableName})`
        );
      }
    }

    try {
      await fs.writeFile(filepath, fileContent);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  try {
    await fs.writeFile("results.json", JSON.stringify(translations, null, 2));
    console.log("Translation keys extracted and saved to 'results.json'");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

function generateVariableName(key) {
  const words = key.split(/\s+/);
  const capitalizedWords = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const combinedWords = capitalizedWords.join("");
  const sanitizedVariableName = combinedWords.replace(/[^a-zA-Z0-9]/g, "");

  return sanitizedVariableName;
}
