#!/usr/bin/env node

const importLocal = require("import-local");

if (importLocal(__filename)) {
    require("npmLog").info("cli", "Useing cli local");
} else {
    require("../lib/core.js")(process.argv.slice(2));
}
