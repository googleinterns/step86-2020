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
