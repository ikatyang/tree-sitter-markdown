module.exports = {
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
