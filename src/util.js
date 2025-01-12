/**
 * 公用方法
 */

const fs = require("fs");
const path = require("path");
/**
 * node 通过路径读取文件内容
 * @param {*} filePath
 */
const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log("data:", data);
        resolve(data);
      }
    });
  });
};

/**
 * 读取当前目录下所有文件名称
 * @param {*} dirPath
 * @returns
 */
const readDir = (dirPath) => {
  const _dirPath = path.resolve(__dirname, dirPath);
  return new Promise((resolve, reject) => {
    fs.readdir(_dirPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const _files = files.map((file) => ({
          path: _dirPath + file,
          name: file,
        }));
        console.log(_files);
        resolve(_files);
      }
    });
  });
};

/**
 * 读取当前目录下所有文件名称
 * @param {*} dirPath
 * @returns
 */
function readAllDirectoriesAndFiles(dirPath) {
  const _dirPath = path.resolve(__dirname, dirPath);
  const results = [];
  try {
    const entries = fs.readdirSync(_dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const filePath = path.join(_dirPath, entry.name);
      if (entry.isDirectory()) {
        const subEntries = readAllDirectoriesAndFiles(filePath);
        results.push({
          // path: filePath,
          name: entry.name,
          children: subEntries,
        });
      } else if (entry.name.toLowerCase().indexOf("md") > 0) {
        results.push({
          // path: filePath,
          name: entry.name,
          // children: [],
        });
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
  // console.log([results]);
  return results.length > 0 ? results : [];
}

/**
 * 将字符串写出到指定文件
 * @param {*} filePath
 * @param {*} content
 */
async function writeStringToFileSync(filePath, content) {
  await createFileIfNotExistsSync(filePath);
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
  /**
   * 判断文件是否存在，不存在则创建文件
   * @param {*} filePath
   * @param {*} content
   */
  function createFileIfNotExistsSync(filePath, content = "") {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        try {
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`File created at ${filePath}`);
          resolve(true);
        } catch (error) {
          console.error("Error creating file:", error);
          reject(false);
        }
      } else {
        resolve(true);
      }
    });
  }
}

/**
 * 递归删除指定文件
 * @param {*} dirPath
 * @param {*} fileNameToDelete
 */
function traverseDirectory(dirPath, fileNameToDelete) {
  const _dirPath = path.resolve(__dirname, dirPath);
  fs.readdir(_dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${_dirPath}:`, err);
      return;
    }
    console.log(files);
    files.forEach((file) => {
      const filePath = path.join(_dirPath, file.name);

      if (file.isDirectory()) {
        // 如果是目录，则递归进入
        traverseDirectory(filePath, fileNameToDelete);
      } else {
        // 如果是文件，则检查是否需要删除
        deleteFileIfMatch(filePath, fileNameToDelete);
      }
    });
  });
  // 递归删除指定文件
  function deleteFileIfMatch(filePath, fileNameToDelete) {
    if (filePath.endsWith(fileNameToDelete)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    }
  }
}

/**
 * 生成nav 字符串
 */
function generateNavInfo(dirInfo) {
  let temp = { nav: [], sidebar: {} };
  const { name, children } = dirInfo;
  const base = "/views";
  // nav
  temp.nav = [{ text: name, items: [] }];
  temp.nav[0].items = children
    .map((item) => {
      return {
        text: item.name,
        link: `${base}/${name}/${item.name}/readme.md`,
      };
    })
    .filter((item) => item.text?.toLowerCase().indexOf("readme") == -1);
  // sidebar
  temp.sidebar = children
    .filter((item) => item.name?.toLowerCase().indexOf("readme") == -1)
    .reduce((def, item) => {
      let key = `${base}/${name}/${item.name}`;
      def[key] = [
        {
          text: item.name,
          collapsed: false,
          items: generateSidebar(item, key),
        },
      ];
      return def;
    }, {});
  //
  function generateSidebar(itemInfo, base) {
    const { name, children } = itemInfo;
    let _temp = [];
    if (children?.length > 0) {
      _temp = children
        .filter((item) => item.name?.toLowerCase().indexOf("readme") == -1)
        .map((item) => {
          let name = item.name.split(".")[0];
          let _item = { text: name };
          if (item.children) {
            _item.items = generateSidebar(item, `${base}/${name}`);
            _item.collapsed = false;
          } else if (item.name.indexOf(".") > -1) {
            _item.link = `${base}/${name}`;
          }
          return _item;
        })
        .filter((item) => item.title?.toLowerCase() !== "readme");
    }
    return _temp;
  }

  // console.log(temp.nav);
  return [temp, `${base}/${name}`];
}

module.exports = {
  readFile,
  readDir,
  readAllDirectoriesAndFiles,
  writeStringToFileSync,
  traverseDirectory,
  generateNavInfo,
};
