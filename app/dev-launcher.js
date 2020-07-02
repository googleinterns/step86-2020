const puppeteer = require("puppeteer");
const path = require("path");

const { exec } = require("child_process");
const { promisify } = require("util");

const EXTENSION_PATH = path.resolve(__dirname, "dist");

let browser;

/** Run a full extension build */
const build = async () => {
  await promisify(exec)("npm run build");
  console.log("Built");
};

/** Launch a new chrome window with the extension loaded */
const launch = async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });
  console.log("Launched");
};

/** Shutdown the open chrome window, if exists */
const shutdown = async () => {
  if (browser) {
    await browser.close();
  }
  console.log("Shut down");
};

/** Restart chrome, reload current webpage if needed. */
const relaunch = async () => {
  const currentUrl = browser && (await browser.pages())[0].url();
  await build();
  await shutdown();
  await launch();
  currentUrl && (await (await browser.pages())[0].goto(currentUrl));
  console.log("Re-launched");
};

/** Allows simple control of launcher from command line. */
process.stdin.on("data", async (data) => {
  const command = data.toString().slice(0, -1);
  switch (command) {
    case "r":
      await relaunch();
      break;
    case "q":
      await shutdown();
      process.exit(0);
      break;
  }
});

relaunch();
