import React from "react";
import ReactDOM from "react-dom";

export class Popup extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
      </div>
    );
  }
}

// Mounts popup once html is loaded
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const appMount = document.querySelector("#app");
    ReactDOM.render(<Popup />, appMount);
  },
  false
);
