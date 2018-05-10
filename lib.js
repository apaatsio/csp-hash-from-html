const cheerio = require("cheerio");
const cryptojs = require("crypto-js");
const glob = require("glob");
const fs = require("fs");

function generateHashes(globArg, algorithm) {
  const files = glob.sync(globArg);
  if (files.length === 0) {
    console.error("No files found with glob pattern " + globArg);
    process.exit(1);
  }
  const hashes = files
    .map(function(fileName) {
      // get all inline snippets
      const fileContent = fs.readFileSync(fileName);
      const $ = cheerio.load(fileContent);
      return $("script:not([src]), style")
        .map(function() {
          return $(this).html();
        })
        .get();
    })
    .reduce(function(resultArray, array) {
      // flattern arrays
      return resultArray.concat(array);
    }, [])
    .filter(function(item, pos, self) {
      // remove duplicates
      return self.indexOf(item) == pos;
    })
    .map(function(inlineContent) {
      // encode
      const cryptoFunctionName = algorithm.toUpperCase();
      const cryptoFunction = cryptojs[cryptoFunctionName];
      const base64Hash = cryptoFunction(inlineContent).toString(
        cryptojs.enc.Base64
      );
      return base64Hash;
    });

  const formattedHashes = hashes.map(function(hash) {
    return "'" + algorithm + "-" + hash + "'";
  });

  return formattedHashes;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = generateHashes;
} else {
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return generateHashes;
    });
  }
}
