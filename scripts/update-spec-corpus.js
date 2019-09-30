const fs = require("fs");

writeTest("./corpus/spec.txt", getSpecExamples("./gfm-spec/spec.txt"));

function getSpecExamples(specFilename) {
  const specText = fs.readFileSync(specFilename, "utf8");
  return specText
    .match(
      /```````````````````````````````` example([^]+?)````````````````````````````````/g,
    )
    .map(codeBlock =>
      codeBlock
        .split("\n")
        .slice(1, -1)
        .join("\n")
        .split(/^\.$/m)[0]
        .replace(/→/g, "\t"),
    );
}

function writeTest(filename, specExamples) {
  fs.writeFileSync(
    filename,
    specExamples
      .map((specExample, i) =>
        [
          "=".repeat(80),
          `Example ${i + 1} - https://github.github.com/gfm/#example-${i + 1}`,
          "=".repeat(80),
          specExample,
          "-".repeat(80),
          "",
          "()",
          "",
        ].join("\n"),
      )
      .join("\n"),
  );
}
