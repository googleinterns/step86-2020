import * as extensionAuthHandler from "./extensionAuthHandler";
import * as backgroundRequestHandler from "./backgroundRequestHandler";

window.onload = (event) => {
  backgroundRequestHandler.register().listen();
  
   // The first time we authenticate, we want it to be manual (for good UX.)
  // However, after that, it's okay to automatically authenticate.
  if (extensionAuthHandler.hasUserAuthConsent()) {
    extensionAuthHandler.startPollingAuth();
  }
};
