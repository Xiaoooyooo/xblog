import fs from "fs";

export function isFileExits(filename: string) {
  return new Promise<fs.Stats | null>((resolve) => {
    fs.stat(filename, (err, stat) => {
      if (err) {
        return resolve(null);
      }
      if (stat.isFile()) {
        return resolve(stat);
      }
      resolve(null);
    });
  });
}

export function tryToCreateDir(path: string) {
  return new Promise<void>((resolve) => {
    fs.stat(path, async (err, stat) => {
      if (err) {
        await createDir(path);
        return resolve();
      }
      if (stat.isDirectory()) {
        return resolve();
      }
    });
  });
}

export function createDir(path: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err, path) => {
      if (err) {
        return reject(err);
      }
      resolve(path);
    });
  });
}

export function moveFile(source: string, destination: string) {
  return new Promise<void>((resolve, reject) => {
    fs.copyFile(source, destination, (err) => {
      if (err) {
        return reject(err);
      }
      fs.unlink(source, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

export async function removeFile(filename: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filename, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
