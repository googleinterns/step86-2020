import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import {showAlert} from "../injected/temporary";
showAlert();


class InjectedApp extends React.Component {

  constructor(){
    super();
  }

  render() {
    return (
      <div>
        <h1> Welcome to chathead !</h1>
        <button onClick={showAlert}>Show an Alert</button>
      </div>
    );
  }

}

// Mounts popup once html is loaded
//document.addEventListener(
 // "DOMContentLoaded",
  //() => {
    // const appMount = document.querySelector("#injected-app");
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    ReactDOM.render(<InjectedApp />, mount);
//  },
  //false
//);
