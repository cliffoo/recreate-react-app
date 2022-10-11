const escapeCodes = {
  reset: "\x1b[0m",
  fgYellow: "\x1b[33m",
  fgCyan: "\x1b[36m"
};

function colorString(str, color) {
  return escapeCodes.hasOwnProperty(color)
    ? escapeCodes[color] + str + escapeCodes.reset
    : str;
}

module.exports = colorString;
