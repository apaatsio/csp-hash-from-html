const generateHashes = require("../dist/lib");

const simpleTestFile = "./test/fixtures/simple.html";
const fullTestFile = "./test/fixtures/full.html";
const duplicateTestFile = "./test/fixtures/duplicate.html";
const multipleFilesGlobPattern = "./test/fixtures/**/*.html";

describe("lib", function() {
  it("generates SHA-256 hashes", function() {
    const hashes = generateHashes(simpleTestFile, "sha256");
    expect(hashes).toEqual([
      "'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M='"
    ]);
  });
  it("generates SHA-384 hashes", function() {
    const hashes = generateHashes(simpleTestFile, "sha384");
    expect(hashes).toEqual([
      "'sha384-Gm/rF9pxg13tUXAELiuK0ImgzPzZMYe+4fX6pVRssnMGbQiQKQ5oRIh+OcK63+b/'"
    ]);
  });
  it("generates SHA-512 hashes", function() {
    const hashes = generateHashes(simpleTestFile, "sha512");
    expect(hashes).toEqual([
      "'sha512-db/hMIqwAluplNhN8AE/Ys06U2p+L1Z4QHX4fdFcW7fmECa40O1lQc4IcGqdQlskInitjxS8rPpA+Q1ZETzyCw=='"
    ]);
  });
  it("generates hashes for all inline script and inline style tags", function() {
    const hashes = generateHashes(fullTestFile, "sha256");
    expect(hashes).toHaveLength(8);
    expect(hashes).toEqual([
      "'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M='",
      "'sha256-GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo='",
      "'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y='",
      "'sha256-CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY='",
      "'sha256-yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc='",
      "'sha256-SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA='",
      "'sha256-bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU='",
      "'sha256-54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0='"
    ]);
  });
  it("outputs only one hash for duplicate hashes", function() {
    const hashes = generateHashes(duplicateTestFile, "sha256");
    expect(hashes).toHaveLength(1);
    expect(hashes).toEqual([
      "'sha256-2pMXmk3mqqMJBxUQyF5gazxWlTdaHG8M5+O5XdcCwpE='"
    ]);
  });
  it("opens multiple files when given a glob pattern", function() {
    expect.assertions(10);
    const hashes = generateHashes(multipleFilesGlobPattern, "sha256");
    expect(hashes).toHaveLength(9);
    [
      "'sha256-2pMXmk3mqqMJBxUQyF5gazxWlTdaHG8M5+O5XdcCwpE='",
      "'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M='",
      "'sha256-GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo='",
      "'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y='",
      "'sha256-CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY='",
      "'sha256-yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc='",
      "'sha256-SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA='",
      "'sha256-bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU='",
      "'sha256-54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0='"
    ].map(function(hash) {
      expect(hashes).toContain(hash);
    });
  });
  it("throws on if no files are found", function() {
    expect(function() {
      generateHashes("DOES_NOT_EXIST", "sha256");
    }).toThrow();
  });
  it("throws on unknown algorithm", function() {
    expect(function() {
      generateHashes(simpleTestFile, "foo");
    }).toThrow();
  });
});
