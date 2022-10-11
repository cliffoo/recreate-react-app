const path = require("path");
const fse = require("fs-extra");

// Return true if dir is empty or does not exist, false otherwise
function isDirEmpty(dirName) {
  const absoluteDirPath = path.resolve(dirName);
  if (fse.pathExistsSync(absoluteDirPath)) {
    return fse.readdirSync(absoluteDirPath).length === 0;
  }
  return true;
}

module.exports = isDirEmpty;
