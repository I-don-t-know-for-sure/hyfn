const fs = require("fs");
const path = require("path");
const pathToDir = process.argv[2];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// Example usage:
const files = getAllFiles(pathToDir);
console.log(files);

const translations = {};

files.forEach((filepath) => {
  fs.readFile(filepath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const regex = /t\(['"](.*?)['"]\)/g;
    const matches = data.matchAll(regex);

    for (const match of matches) {
      const key = match[1];
      if (!(key in translations)) {
        translations[key] = key;
      }
    }

    console.log(translations);
    fs.writeFileSync("results.json", JSON.stringify(translations, null, 2));
  });
});
