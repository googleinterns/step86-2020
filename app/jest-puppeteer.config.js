const path = require("path");

const EXTENSION_PATH = path.resolve(__dirname, "dist"); // path of built extension

module.exports = {
  // Launches a controllable chrome window, installs only this extension.
  launch: {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  },
};
