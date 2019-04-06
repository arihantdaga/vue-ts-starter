'use strict';

// console.log("Build Process Starting...");
var shell = require("shelljs");
shell.exec("npm run build");
// console.log("Build Finished");
// console.log("Starting Coyping");
shell.exec("node ./build_helpers/copytoServer.js");
// console.log("Finished Copying");
