/**
 * 更新views 目录下所有目录文件
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

// readFile("./util.js");
// 递归删除指定文件
// traverseDirectory("../docs/views", 'info.json');
// generateNavFilesInFirstLevelDirectories("../docs/views", "text.json");

const run = () => {
  const tempFile = "temp.json";
  console.log("updateViewsNav start");
  // 1. 读取指定目录下所有目录及文件，包括子目录
  const result = readAllDirectoriesAndFiles("../docs/views");
//   writeStringToFileSync(tempFile, JSON.stringify(result, null, 2));

  // 2. 遍历结果，生成 nav.js 文件
  result.forEach((item) => {
    let [info, filePath] = generateNavInfo(item);
    let _path = path.resolve(__dirname, `../docs${filePath}/nav.json`);
    // console.log(__dirname, _path);
    writeStringToFileSync(_path, JSON.stringify(info, null, 2));
  });
};
console.log("updateViewsNav end");

run();

module.export = run;