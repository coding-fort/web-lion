/**
 * 将vuepress 对于的配置文件转换为vitepress的配置文件
 */
// const fs = require("fs");
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
 *
 */
module.exports = () => {
  console.log("changeToVitePress start");
  // 1. 读取指定目录下所有目录及文件，包括子目录
  const result = readAllDirectoriesAndFiles("../docs/views");
  // 2. 遍历结果，生成 nav.js 文件
  result.forEach((item) => {
    let [info, filePath] = generateNavInfo(item);
    let _path = path.resolve(__dirname, `../docs${filePath}/nav.json`);
    // console.log(__dirname, _path);
    writeStringToFileSync(_path, JSON.stringify(info, null, 2));
  });
  console.log("changeToVitePress end");
};
