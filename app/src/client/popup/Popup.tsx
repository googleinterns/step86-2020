import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const Wrapper = styled.section`
  padding: 6em;
`;

export class Popup extends React.Component {
  constructor(){
    super();
  }
  
  render() {
    return (
      <Wrapper>
        <Title>Welcome to Cloud Debugger !</Title>
      </Wrapper>
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
