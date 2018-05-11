#!/usr/bin/env node

const program = require("commander");
const { formattedHashesFromFiles } = require("./lib");
const packageJson = require("../package.json");

program
  .version(packageJson.version)
  .description(packageJson.description)
  .usage("[options] <fileOrGlob>")
  .option(
    "-a, --algorithm <value>",
    "hash algorithm (sha256, sha384, sha512)",
    /^(sha256|sha384|sha512)$/i,
    "sha256"
  )
  .option(
    "-d, --directive <value>",
    "directive (default-src, script-src, style-src)",
    /^(default-src|script-src|style-src)$/i,
    "default-src"
  )
  .option("--debug", "verbose output for debugging")
  .on("--help", function() {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ csp-hash index.html");
    console.log("    $ csp-hash build/**/*.html");
    console.log("    $ csp-hash -a sha512 index.html");
    console.log("    $ csp-hash -d script-src index.html");
    console.log("");
  })
  .parse(process.argv);

try {
  const formattedHashes = formattedHashesFromFiles(program.args[0], {
    algorithm: program.algorithm,
    directive: program.directive,
    debug: program.debug === true
  });
  console.log(formattedHashes);
} catch (error) {
  console.error(error);
  process.exit(1);
}
