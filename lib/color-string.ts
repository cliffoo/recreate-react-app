type EscapeCode = keyof typeof escapeCodes;
const escapeCodes = {
  reset: "\x1b[0m",
  fgYellow: "\x1b[33m",
  fgCyan: "\x1b[36m",
};

export default function colorString(data: string, color: string) {
  return escapeCodes.hasOwnProperty(color)
    ? escapeCodes[<EscapeCode>color] + data + escapeCodes.reset
    : data;
}
