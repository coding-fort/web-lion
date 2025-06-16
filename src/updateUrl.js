/**
 * @file updateUrl.js
 */

const fs = require("fs");
const path = require("path");
const {
  readFile,
  readDir,
  readAllDirectoriesAndFiles,
  writeStringToFileSync,
  traverseDirectory,
  generateNavInfo,
} = require("./util.js");


/**
 * 递归读取指定目录下所有.md 文件
 */
function readAllMdFiles(dir) {
  const mdFiles = [];
  traverseDirectory(dir, (filePath) => {
    if (filePath.endsWith(".md")) {
      mdFiles.push(filePath);
    }
  });
  return mdFiles;
}

const run = () => {
  const tempFile = "temp.json";
  console.log("updateUrl start");
  // 1. 读取指定目录下所有目录及文件，包括子目录
  const result = readAllDirectoriesAndFiles("../docs/views");
  //   writeStringToFileSync(tempFile, JSON.stringify(result, null, 2));

  // 2. 遍历结果，生成 nav.js 文件
  result.forEach((item) => {
    let [info, filePath] = generateNavInfo(item);
    let _path = path.resolve(__dirname, `../docs${filePath}/nav.json`);
    console.log(__dirname, _path);
  });
};
console.log("updateUrl end");

run();

module.export = run;
