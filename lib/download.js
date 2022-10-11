const https = require("https");
const { Buffer } = require("buffer");

// Perform GET request on uri and return response data as a Buffer.
function download(uri) {
  return new Promise((resolve, reject) => {
    https.get(uri, res => {
      const chunks = [];
      res
        .on("data", chunk => void chunks.push(chunk))
        .on("end", () => void resolve(Buffer.concat(chunks)));
    })
      .on("error", err => void reject(err));
  });
}

module.exports = download;
