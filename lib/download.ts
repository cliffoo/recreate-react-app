import https from "https";
import { Buffer } from "buffer";

export default function download(uri: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(uri, res => {
        const chunks: any[] = [];
        res
          .on("data", chunk => void chunks.push(chunk))
          .on("end", () => void resolve(Buffer.concat(chunks)));
      })
      .on("error", err => void reject(err));
  });
}
