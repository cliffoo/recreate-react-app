const path = require("path");
const fse = require("fs-extra");
const { fromBuffer } = require("yauzl");

const isDir = str => /\/$/.test(str);
const isAtRoot = str => !(/\//.test(str));
const afterFirstForwardSlash = /(?<=\/).*/;
const beforeFirstForwardSlash = /.*(?<=\/)/;

function getRelativePaths(entry) {
  const relativeFilePath = entry.fileName.match(afterFirstForwardSlash)[0];
  return {
    relativeDirPath: isAtRoot(relativeFilePath)
      ? "./"
      : relativeFilePath.match(beforeFirstForwardSlash)[0],
    relativeFilePath
  };
};

function unzip(buffer, destDirName) {
  return new Promise((resolve, reject) => {
    fromBuffer(buffer, { lazyEntries: true }, (err, zipFile) => {
      if (err) reject(err);

      zipFile.readEntry();
      zipFile
        .on("entry", entry => {
          if (isDir(entry.fileName)) {
            zipFile.readEntry();
          } else {
            zipFile.openReadStream(entry, (err, readStream) => {
              if (err) reject(err);

              readStream.on("end", () => {
                zipFile.readEntry();
              });

              const { relativeDirPath, relativeFilePath } = getRelativePaths(entry);
              const absoluteDirPath = path.resolve(destDirName, relativeDirPath);
              const absoluteFilePath = path.resolve(destDirName, relativeFilePath);
              fse.ensureDirSync(absoluteDirPath);

              const writeStream = fse.createWriteStream(absoluteFilePath);
              readStream.pipe(writeStream);
            });
          }
        })
        .on("end", resolve);
    });
  });
}

module.exports = unzip;
