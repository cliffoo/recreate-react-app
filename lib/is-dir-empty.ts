import path from "path";
import fse from "fs-extra";

export default function isDirEmpty(dirName: string) {
  const absoluteDirPath = path.resolve(dirName);
  if (fse.pathExistsSync(absoluteDirPath)) {
    return fse.readdirSync(absoluteDirPath).length === 0;
  }
  return true;
}
