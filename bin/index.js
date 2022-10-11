#!/usr/bin/env node
const isDirEmpty = require("../lib/isDirEmpty");
const download = require("../lib/download");
const unzip = require("../lib/unzip");
const colorString = require("../lib/colorString");

const GITHUB_ORG = "cliffoo";
const REPO = "recreate-react-app-files";
const REPO_BRANCH = "master";
const DEST_DIR = process.argv[2] ?? "react-app";

async function main() {
  if (!isDirEmpty(DEST_DIR)) {
    console.log(
      colorString(
        `./${DEST_DIR} is not empty. Try \`npx recreate-react-app <new-or-empty-directory-name>\``,
        "fgYellow"
      )
    );
    return;
  }

  const buffer = await download(`https://codeload.github.com/${GITHUB_ORG}/${REPO}/zip/${REPO_BRANCH}`);
  await unzip(buffer, DEST_DIR);
  console.log(
    "Done! Next steps:\n" +
    " - " + colorString(`\`cd ${DEST_DIR}\``, "fgCyan") + "\n" +
    " - Install dependencies: " + colorString("`yarn`", "fgCyan") +
    ", " + colorString("`npm i`", "fgCyan") +
    ", or " + colorString("`pnpm i`", "fgCyan") + "\n" +
    "   depending on which package manager you prefer\n" +
    " - Start dev server: " + colorString("`yarn|npm|pnpm run start`", "fgCyan") + "\n" +
    " - Build for production: " + colorString("`yarn|npm|pnpm run build`", "fgCyan")
  );
}

main();
