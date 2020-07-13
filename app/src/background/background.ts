import * as extensionAuthHandler from "./extensionAuthHandler";
import * as backgroundRequestHandler from "./backgroundRequestHandler";

window.onload = (event) => {
  // Refreshes Auth token every 5 minutes
  setInterval(() => {
    extensionAuthHandler.getToken();
  }, 5 * 60 * 1000); 
  extensionAuthHandler.getToken(); // Also authenticates immediately.
  backgroundRequestHandler.BackgroundRequestHandler.listen();
};
