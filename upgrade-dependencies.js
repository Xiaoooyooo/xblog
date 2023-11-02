#!/usr/env/bin node

/**
 * 更新 package.json 依赖
 */
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const args = process.argv.slice(2);
const cwd = process.cwd();

const [package] = args;

const fullPath = path.resolve(cwd, package, "package.json");

if (!fs.existsSync(fullPath)) {
  console.log(`file: ${fullPath} is not exists.`);
  process.exit(1);
}

/**
 * @param {object} packages
 */
async function upgrade(packages) {
  if (!packages) {
    console.log("packages should not be empty");
    return;
  }
  const newPackages = {};
  for (let _package in packages) {
    const old = packages[_package];
    const flag = old.match(/^(.)[\d.]+/);
    const latest = `${flag[1]}${await getLatest(_package)}`;
    newPackages[_package] = latest;
    console.log(`upgrade ${_package} from ${old} to ${latest}`);
  }
  return newPackages;
}

/**
 * @param {string} package
 */
async function getLatest(package) {
  return new Promise((resolve, reject) => {
    // cp.spawn(`npm view ${package} version`);
    cp.exec(`npm view ${package} version`, (err, stdout, stderr) => {
      if (err) reject(err);
      if (stderr) reject(stderr);
      resolve(stdout.trim());
    });
  }).catch((err) => {
    console.log(`get latest version of ${package} failed, try again...`);
    return getLatest(package);
  });
}

try {
  const originContent = JSON.parse(fs.readFileSync(fullPath));
  (async function () {
    originContent.dependencies = await upgrade(originContent.dependencies);
    // prettier-ignore
    originContent.devDependencies = await upgrade(originContent.devDependencies);
    fs.writeFileSync(fullPath, JSON.stringify(originContent, null, 2));
    process.exit(0);
  })();
} catch (err) {
  console.log(err);
}
