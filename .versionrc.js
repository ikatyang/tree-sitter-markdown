module.exports = {
  preset: "angular",
  scripts: {
    postbump: [
      "cargo package --list --allow-dirty && git add Cargo.lock",
      "rm -r docs && node scripts/generate-playground.js && git add docs",
    ].join(" && "),
  },
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "Cargo.toml",
      updater: createTomlUpdater(),
    },
  ],
};

function createTomlUpdater() {
  const regex = /^version = "(.+)"$/m;
  return {
    readVersion(content) {
      return content.match(regex)[1];
    },
    writeVersion(content, version) {
      return content.replace(regex, `version = "${version}"`);
    },
  };
}
