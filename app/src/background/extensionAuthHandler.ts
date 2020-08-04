import api from "debugger-extension-api";

let access_token = null;

/**
 * Gets OAuth token calling the Chrome.identity api and send that
 * to the debugger-extension API.The interactive param indicates if a new window will
 * be opened when the user is not yet authenticated or not.
 */
export function getToken() {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
      return;
    }
    access_token = token;
    setAuthToken(access_token);
  });
}

/**
 * Sets OAuth token making a call to the debugger-extension api.
 * @param {String} access_token User's Oauth token to access debugger-extension api.
 */
export function setAuthToken(access_token) {
  api.setAuthToken(access_token);
}

/** After being called, this will authenticate once (initially), and every 5 minutes. */
export async function startPollingAuth() {
  // Set interval doesn't call at time 0, so must manually do this.
  await getToken();
  setInterval(() => {
    getToken();
  }, 5 * 60 * 1000);
}

/** Use this to set the user's auth consent. If they manually sign in once,
 * we'll assume we have permission to automatically sign in going forward.
 */
export function setUserAuthConsent(hasConsent: boolean) {
  // This manual string cast is needed for local storage.
  localStorage.setItem("auth-consent", hasConsent ? "true" : "false");
}

/** If true, this means the user has consented to auth in the past,
 * and we can sign in automatically.
 */
export function hasUserAuthConsent() {
  return localStorage.getItem("auth-consent") === "true";
}