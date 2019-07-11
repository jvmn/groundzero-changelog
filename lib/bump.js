const fs = require('fs');
const semver = require('semver');
const getPackageJsonPath = () => `${ process.cwd() }/package.json`;
const packageJson = require(getPackageJsonPath());
const writePackageJson = configObject =>
    fs.writeFileSync(getPackageJsonPath(),
        `${ JSON.stringify(configObject, null, 2) }\n`);
let oldVersion = packageJson.version;
let newStableVersion; 

function bumpVersion(releaseType) {
    // Tag a new release
    newStableVersion = packageJson.version = semver.inc(oldVersion, releaseType);
    writePackageJson(packageJson);
    console.log(`Version bumped from ${ oldVersion } to ${ newStableVersion }`);
}

function getNewVersion() {
    return newStableVersion || packageJson.version;
}

function getOldVersion() {
    if (!oldVersion) {
        oldVersion = "0.0.1";
    }
    return oldVersion;
    // console.log("getOldVersion", oldVersion);
}

module.exports = {
    bumpVersion: bumpVersion,
    oldVersion: getOldVersion,
    newVersion: getNewVersion
}