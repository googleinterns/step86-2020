import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import {showAlert} from "../injected/temporary";


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
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const appMount = document.querySelector("#injected-app");
    console.log("hello world");
    ReactDOM.render(<InjectedApp />, appMount);
  },
  false
);
