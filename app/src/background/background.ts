import * as extensionAuthHandler from "./extensionAuthHandler";
import * as backgroundRequestHandler from "./backgroundRequestHandler";

window.onload = (event) => {
  backgroundRequestHandler.BackgroundRequestHandler.listen();
};
