import api from "debugger-extension-api"

let access_token = null;
function getToken() {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
      }
      access_token = token;
    });
}

function setAuthToken(access_token){
  api.setAuthToken(access_token);
}


window.onload = (event) => {
    getToken();
  };