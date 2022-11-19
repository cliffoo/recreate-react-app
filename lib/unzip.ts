import path from "path";
import fse from "fs-extra";
import type { Buffer } from "buffer";
import { fromBuffer } from "yauzl";
import type { Entry } from "yauzl";

const isDir = (data: string) => /\/$/.test(data);
const isAtRoot = (data: string) => !/\//.test(data);
const afterFirstForwardSlash = /(?<=\/).*/;
const beforeFirstForwardSlash = /.*(?<=\/)/;

function getRelativePaths(entry: Entry) {
  const relativeFilePath = entry.fileName.match(afterFirstForwardSlash)![0];
  return {
    relativeDirPath: isAtRoot(relativeFilePath)
      ? "./"
      : relativeFilePath.match(beforeFirstForwardSlash)![0],
    relativeFilePath,
  };
}

export default function unzip(buffer: Buffer, destDirName: string) {
  return new Promise((resolve, reject) => {
    fromBuffer(buffer, { lazyEntries: true }, (err, zipFile) => {
      if (err) reject(err);

      zipFile.readEntry();
      zipFile
        .on("entry", (entry: Entry) => {
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
