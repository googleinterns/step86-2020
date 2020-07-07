import * as extensionAuthHandler from "./extensionAuthHandler"; 
import * as backgroundRequestHandler from "./backgroundRequestHandler"; 


window.onload = (event) => {
    extensionAuthHandler.getToken();
    backgroundRequestHandler.BackgroundRequestHandler.listen();
  };