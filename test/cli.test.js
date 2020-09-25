const child_process = require("child_process");

const binary = "./dist/cli.js";
const simpleScriptTestFile = "./test/fixtures/simple-script.html";
const simpleStyleTestFile = "./test/fixtures/simple-style.html";
const fullTestFile = "./test/fixtures/full.html";
const globPattern = "./test/fixtures/**/*.html";

describe("cli", function() {
  it("prints a single hash", function() {
    const processData = child_process.spawnSync(binary, [simpleScriptTestFile]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toBe(
      "default-src: 'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=';\n"
    );
  });
  it("prints multiple hashes", function() {
    const processData = child_process.spawnSync(binary, [fullTestFile]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toBe(
      "default-src: " +
        "'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=' " +
        "'sha256-GzJO4ZuiXtiD8embdtV797ze4t6fP9ywiLQ4oRqkbzo=' " +
        "'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=' " +
        "'sha256-CBYiR5UmVwAzSf6G8MIH7ttzIEHxcy5JPmhSOh1wKMY=' " +
        "'sha256-yyEvkA5Ew/Va6QW2iyFoZ84hyMHBL4PnezlXGfjTWqc=' " +
        "'sha256-SWutTkqidY1WWe7tZaTPCReI1Zu8lfs57vBJNk1rRLA=' " +
        "'sha256-bHaqd22J9SgkwYJLD7NyCfje+0FpGLeVLxNdDUEatVU=' " +
        "'sha256-54Ts+VLkYKICZxtMuo7M3U9yna7IZCWQJfdCFIheZp0=';\n"
    );
  });
  it("accepts multiple files", function() {
    const processData = child_process.spawnSync(binary, [
      simpleScriptTestFile,
      simpleStyleTestFile
    ]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toMatch(
      /^default-src:( 'sha256-[a-zA-Z0-9+/=]{44}'){2};\n$/
    );
  });
  it("accepts glob pattern", function() {
    const processData = child_process.spawnSync(binary, [globPattern]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toMatch(
      /^default-src:( 'sha256-[a-zA-Z0-9+/=]{44}'){9};\n$/
    );
  });
  it("accepts algorithm with -a", function() {
    const processData = child_process.spawnSync(binary, [
      "-a",
      "sha384",
      simpleScriptTestFile
    ]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toBe(
      "default-src: 'sha384-Gm/rF9pxg13tUXAELiuK0ImgzPzZMYe+4fX6pVRssnMGbQiQKQ5oRIh+OcK63+b/';\n"
    );
  });
  it("accepts directive with -d", function() {
    const processData = child_process.spawnSync(binary, [
      "-d",
      "script-src",
      simpleScriptTestFile
    ]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toBe(
      "script-src: 'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=';\n"
    );
  });
  it("prints help with -h", function() {
    const processData = child_process.spawnSync(binary, ["-h"]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(output).toMatchSnapshot();
  });
  it("prints verbose output with --debug", function() {
    const processData = child_process.spawnSync(binary, [
      "--debug",
      simpleScriptTestFile
    ]);
    const statusCode = processData.status;
    expect(statusCode).toBe(0);
    const output = processData.stdout.toString("utf8");
    expect(clearAnsiStyles(output)).toMatchSnapshot();
  });
});

function clearAnsiStyles(str) {
  return str.replace(/\u001B\[\d+m/g, "");
}
