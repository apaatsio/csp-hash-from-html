const fs = require("fs");
const { formattedHashesFromFiles, rawHashesFromHtml } = require("../dist/lib");

const simpleScriptTestFile = "./test/fixtures/simple-script.html";
const simpleStyleTestFile = "./test/fixtures/simple-style.html";
const fullTestFile = "./test/fixtures/full.html";
const duplicateTestFile = "./test/fixtures/duplicate.html";
const multipleFilesGlobPattern = "./test/fixtures/**/*.html";

const simpleScriptHtml = fs.readFileSync(simpleScriptTestFile).toString("utf8");
const simpleStyleHtml = fs.readFileSync(simpleStyleTestFile).toString("utf8");
const fullHtml = fs.readFileSync(fullTestFile).toString("utf8");
const duplicateHtml = fs.readFileSync(duplicateTestFile).toString("utf8");

describe("lib", function() {
  describe("formattedHashesFromFiles()", function() {
    it("generates hashes for all inline script and inline style directives by default", function() {
      const hashes = formattedHashesFromFiles(fullTestFile);
      expect(hashes).toMatch(
        /^default-src:( 'sha256-[a-zA-Z0-9+/=]{44}'){8};$/
      );
    });
    it('generates hashes for all inline script and inline style directives when given option "default"', function() {
      const hashes = formattedHashesFromFiles(fullTestFile, {
        directive: "default-src"
      });
      expect(hashes).toMatch(
        /^default-src:( 'sha256-[a-zA-Z0-9+/=]{44}'){8};$/
      );
    });
    it('generates hashes for only inline scripts when given option "script"', function() {
      const hashes = formattedHashesFromFiles(simpleScriptTestFile, {
        directive: "script-src"
      });
      expect(hashes).toBe(
        "script-src: 'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=';"
      );
    });
    it('generates hashes for only inline styles when given option "style"', function() {
      const hashes = formattedHashesFromFiles(simpleStyleTestFile, {
        directive: "style-src"
      });
      expect(hashes).toBe(
        "style-src: 'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=';"
      );
    });
    it("opens multiple files when given a glob pattern", function() {
      const hashes = formattedHashesFromFiles(multipleFilesGlobPattern);
      expect(hashes).toMatch(
        /^default-src:( 'sha256-[a-zA-Z0-9+/=]{44}'){9};$/
      );
    });
    it("throws on if no files are found", function() {
      expect(function() {
        formattedHashesFromFiles("DOES_NOT_EXIST");
      }).toThrow();
    });
    it("throws on if no file or glob pattern is defined", function() {
      expect(function() {
        formattedHashesFromFiles();
      }).toThrow();
    });
    it("works with debug option", function() {
      global.console.log = jest.fn();
      expect(function() {
        formattedHashesFromFiles(simpleScriptTestFile, {
          debug: true
        });
      }).not.toThrow();
      expect(console.log).toBeCalled();
    });
  });

  describe("rawHashesFromHtml()", function() {
    it("generates SHA-256 hashes by default", function() {
      const hashes = rawHashesFromHtml(simpleScriptHtml);
      expect(hashes).toEqual(["gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M="]);
    });
    it("generates SHA-256 hashes when given option", function() {
      const hashes = rawHashesFromHtml(simpleScriptHtml, {
        algorithm: "sha256"
      });
      expect(hashes).toEqual(["gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M="]);
    });
    it("generates SHA-384 hashes", function() {
      const hashes = rawHashesFromHtml(simpleScriptHtml, {
        algorithm: "sha384"
      });
      expect(hashes).toEqual([
        "Gm/rF9pxg13tUXAELiuK0ImgzPzZMYe+4fX6pVRssnMGbQiQKQ5oRIh+OcK63+b/"
      ]);
    });
    it("generates SHA-512 hashes", function() {
      const hashes = rawHashesFromHtml(simpleScriptHtml, {
        algorithm: "sha512"
      });
      expect(hashes).toEqual([
        "db/hMIqwAluplNhN8AE/Ys06U2p+L1Z4QHX4fdFcW7fmECa40O1lQc4IcGqdQlskInitjxS8rPpA+Q1ZETzyCw=="
      ]);
    });
    it("generates hashes for all inline script and inline style directives by default", function() {
      const hashes = rawHashesFromHtml(fullHtml);
      expect(hashes).toHaveLength(8);
      expect(hashes).toEqual([
        "gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=",
        "GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo=",
        "kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=",
        "CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY=",
        "yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc=",
        "SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA=",
        "bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU=",
        "54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0="
      ]);
    });
    it('generates hashes for all inline script and inline style directives when given option "default-src"', function() {
      const hashes = rawHashesFromHtml(fullHtml, {
        directive: "default-src"
      });
      expect(hashes).toHaveLength(8);
      expect(hashes).toEqual([
        "gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=",
        "GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo=",
        "kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=",
        "CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY=",
        "yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc=",
        "SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA=",
        "bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU=",
        "54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0="
      ]);
    });
    it('generates hashes for only inline scripts when given option "script-src"', function() {
      const hashes = rawHashesFromHtml(fullHtml, {
        directive: "script-src"
      });
      expect(hashes).toHaveLength(4);
      expect(hashes).toEqual([
        "gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=",
        "GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo=",
        "yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc=",
        "SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA="
      ]);
    });
    it('generates hashes for only inline styles when given option "style-src"', function() {
      const hashes = rawHashesFromHtml(fullHtml, {
        directive: "style-src"
      });
      expect(hashes).toHaveLength(4);
      expect(hashes).toEqual([
        "kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=",
        "CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY=",
        "bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU=",
        "54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0="
      ]);
    });
    it("outputs only one hash for duplicate hashes", function() {
      const hashes = rawHashesFromHtml(duplicateHtml);
      expect(hashes).toHaveLength(1);
      expect(hashes).toEqual(["2pMXmk3mqqMJBxUQyF5gazxWlTdaHG8M5+O5XdcCwpE="]);
    });
    it("generates hashes from HTML array", function() {
      const hashes = rawHashesFromHtml([simpleScriptHtml, simpleStyleHtml]);
      expect(hashes).toEqual([
        "gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=",
        "kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y="
      ]);
    });
    it("throws on unknown algorithm option", function() {
      expect(function() {
        rawHashesFromHtml(simpleScriptHtml, { algorithm: "foo" });
      }).toThrow();
    });
    it("throws on unknown directive option", function() {
      expect(function() {
        rawHashesFromHtml(simpleScriptHtml, { directive: "foo" });
      }).toThrow();
    });
    it("throws if options is not an object", function() {
      expect(function() {
        rawHashesFromHtml(simpleScriptHtml, "NOT_AN_OBJECT");
      }).toThrow();
    });
    it("throws if first argument is not a string or array", function() {
      expect(function() {
        rawHashesFromHtml("<div></div>");
      }).not.toThrow();
      expect(function() {
        rawHashesFromHtml(["<div></div>"]);
      }).not.toThrow();
      expect(function() {
        rawHashesFromHtml(123);
      }).toThrow();
      expect(function() {
        rawHashesFromHtml({});
      }).toThrow();
      expect(function() {
        rawHashesFromHtml(function() {});
      }).toThrow();
      expect(function() {
        rawHashesFromHtml(true);
      }).toThrow();
    });
  });
});
