#!/usr/bin/env node

const program = require("commander");
const generateHashes = require("./lib");
const packageJson = require("./package.json");

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
  .on("--help", function() {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ csp-hash index.html");
    console.log("    $ csp-hash -a sha512 index.html");
    console.log("    $ csp-hash build/**/*.html");
    console.log("");
  })
  .parse(process.argv);

try {
  const hashes = generateHashes(program.args[0], program.algorithm);
  console.log(hashes.join(" "));
} catch (error) {
  console.error(error);
  process.exit(1);
}
