import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 6em;
  float:right; 
  background:white; 
  width:25%; 
  height:450px; 
  position:fixed;
  top:50px;
  right:20px; 
  box-shadow: 0 0 6px #000;
  z-index: 10000; 
`;

const Input = styled.input.attrs(props => ({
  size: props.size || "1em",
}))`
 color: #1E90FF;
  font-size: 1em;
  border: 2px solid #1E90FF;
  border-radius: 3px;
  margin: ${props => props.size};
  padding: ${props => props.size};
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "#1E90FF" : "white"};
  color: ${props => props.primary ? "white" : "#1E90FF"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #1E90FF;
  border-radius: 3px;
`;

// declare attributs here
interface InjectedAppState{
  projectId: string,
  debuggeId: string,
  counter: number,
  breakpoints: Array<any>,
  lineNum: number;
  fileName: string;
}

 class InjectedApp extends React.Component<any,InjectedAppState> {

  constructor(){
    super();
    this.state = {
      projectId: "",
      debuggeId: "",
      counter: 20,
      breakpoints : {},
      lineNumber: 29,
      fileName: "index.js"
    }
  }
  
  get getLineNumber(){
    return this.state.lineNumber;
  }

  get fileName(){
    return this.state.fileName;
  }

  set setLineNumber(value: number){
    this.state.lineNumber = value;
  }

  set setFileName(value: string){
    this.state.lineNumber = value;
  }

  showBreakPoint(){
  }

  createBreakPoint(line: number){
    // use request to ccreat a breakpoint   
      return this.getLineNumber;
  }

  render() {
    return (
      <Wrapper>
        <p>Create a Break Point</p>
        <Input placeholder="File Name " />
        <Input placeholder="Line Number " />
        <Button primary onClick={this.createBreakPoint(this.state.lineNumber)}> CREATE </Button>
      </Wrapper>
    );
  }

}

// Mounts injected App once html is loaded
const mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.render(<InjectedApp />, mount);
