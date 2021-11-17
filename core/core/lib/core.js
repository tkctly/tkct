"use strict";
module.exports = core;
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const log = require("@tkct/log");
const pkg = require("../package.json");
const { LOWEST_NODE_VERSION, DEFAULT_CLI_HOME } = require("./const");

let args;

async function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        checkEnv();
        checkGlobalUpdate();
        log.verbose("debug", "test debug log");
    } catch (error) {
        log.error(error.message);
    }
}
async function checkGlobalUpdate() {
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    const { getSemverVersion } = require("@tkct/get-npm-info");
    const lastVersion = await getSemverVersion(currentVersion, npmName);
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(
            colors.yellow(
                `Please update ${npmName}, current version: ${currentVersion}, last version: ${lastVersion}`
            )
        );
    }
}
function checkEnv() {
    const dotenv = require("dotenv");
    const dotenvPath = path.resolve(userHome, ".env");

    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath,
        });
    }
    createDefaultConfig();
    log.verbose("环境变量", process.env.CLI_HOME_PATH);
}
function createDefaultConfig() {
    const cliConfig = {
        home: userHome,
    };

    if (process.env.CLI_HOME) {
        cliConfig.cliHome = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig.cliHome = path.join(userHome, DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
function checkInputArgs() {
    const minimist = require("minimist");
    args = minimist(process.argv.slice(2));
    log.verbose(process.argv.slice(2));
    checkArgs();
}
function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = "verbose";
    } else {
        process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
}
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(clors.error, "错误");
    }
}
function checkRoot() {
    const rootCheck = require("root-check");
    rootCheck();
}
function checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(
            colors.red(`tckt 需要安装v${lowestVersion}以上版本的 nodejs`)
        );
    }
}
function checkPkgVersion() {
    log.notice("cli", pkg.version);
}
