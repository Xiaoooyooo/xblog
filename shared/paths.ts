import path from "path";

const cwd = process.cwd();

function resolve(p: string) {
  return path.resolve(cwd, p);
}

export default {
  DATABASE_PATH: path.resolve(cwd, ".database"),
  HTML_ROOT: resolve(process.env.HTML_ROOT || "WWW"),
};
