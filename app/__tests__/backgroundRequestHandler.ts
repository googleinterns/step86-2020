import chromeApi from "sinon-chrome";
import { BackgroundRequestHandler } from "../src/background/backgroundRequestHandler";

describe("BackgroundRequestHandler", () => {
  beforeAll(() => {
    BackgroundRequestHandler.overrideChromeApi(chromeApi as unknown as typeof chrome)
  });

  beforeEach(() => {
    chromeApi.flush();
  });
});