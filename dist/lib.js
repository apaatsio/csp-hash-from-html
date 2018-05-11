const cheerio = require("cheerio");
const cryptojs = require("crypto-js");
const glob = require("glob");
const fs = require("fs");

const SUPPORTED_ALGORITHMS = ["sha256", "sha384", "sha512"];
const DEFAULT_ALGORITHM = "sha256";
const DIRECTIVE_OPTIONS = ["script-src", "style-src", "default-src"];
const DEFAULT_DIRECTIVE = "default-src";

function verifyFunctionOptions(options) {
  options = options || {};
  if (typeof options !== "object") {
    throw new Error("options must be an object.");
  }
  const algorithm = options.algorithm || DEFAULT_ALGORITHM;
  const directive = options.directive || DEFAULT_DIRECTIVE;
  if (SUPPORTED_ALGORITHMS.indexOf(algorithm) === -1) {
    throw new Error(
      "Unsupported algorithm option " +
        algorithm +
        ". Supported options: " +
        SUPPORTED_ALGORITHMS.join(", ")
    );
  }
  if (DIRECTIVE_OPTIONS.indexOf(directive) === -1) {
    throw new Error(
      "Unsupported directive option " +
        directive +
        ". Supported options: " +
        DIRECTIVE_OPTIONS.join(", ")
    );
  }

  return { algorithm, directive };
}

function formattedHashesFromFiles(globArg, options) {
  if (!globArg) {
    throw new Error("File name or glob pattern must be defined.");
  }
  const { algorithm, directive } = verifyFunctionOptions(options);

  const filePaths = glob.sync(globArg);
  if (filePaths.length === 0) {
    throw new Error("No files found with glob pattern " + globArg);
  }

  const htmlArray = filePaths.map(function(filePath) {
    return fs.readFileSync(filePath);
  });

  const hashes = rawHashesFromHtml(htmlArray, { algorithm, directive });

  return formatHashes(hashes, { algorithm, directive });
}

function rawHashesFromHtml(htmlOrHtmlArray, options) {
  let htmlArray;
  if (htmlOrHtmlArray instanceof Array) {
    htmlArray = htmlOrHtmlArray;
  } else {
    if (typeof htmlOrHtmlArray === "string") {
      htmlArray = [htmlOrHtmlArray];
    } else {
      throw new Error("html argument must be string or an array");
    }
  }
  const { algorithm, directive } = verifyFunctionOptions(options);

  return htmlArray
    .map(function(html) {
      // get all inline snippets
      const $ = cheerio.load(html);
      const cssSelectors = {
        "style-src": "style",
        "script-src": "script:not([src])",
        "default-src": "style, script:not([src])"
      };
      return $(cssSelectors[directive])
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
}

function formatHashes(hashes, options) {
  const { algorithm, directive } = verifyFunctionOptions(options);

  const formattedHashes = hashes.map(function(hash) {
    return "'" + algorithm + "-" + hash + "'";
  });

  return directive + ": " + formattedHashes.join(" ") + ";";
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports.formattedHashesFromFiles = formattedHashesFromFiles;
  module.exports.rawHashesFromHtml = rawHashesFromHtml;
} else {
  if (typeof define === "function" && define.amd) {
    define([], function() {
      return { formattedHashesFromFiles, rawHashesFromHtml };
    });
  }
}
