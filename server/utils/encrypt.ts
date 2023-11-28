import crypto from "crypto";

export function hash(input: string) {
  const hash = crypto.createHash("sha1");
  hash.update(input);
  return hash.digest("hex");
}
