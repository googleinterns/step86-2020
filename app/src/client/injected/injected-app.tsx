import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { Chathead } from "../chathead/Chathead";
import * as BackgroundRequest from "../../common/requests/BackgroundRequest";


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
  debuggeeId: string,
  counter: number,
  breakpoints: Array<any>,
  lineNum: number;
  fileName: string;
  activeBreakpoints: {[key: string]: BreakpointMeta};
  listBreakpoints: Array<any>;
  getBreakpoints: Array<any>;

}

 class InjectedApp extends React.Component<any,InjectedAppState> {

  constructor(){
    super();
    this.state = {
      projectId: undefined,
      debuggeeId: undefined,
      counter: 20,
      breakpoints : {},
      lineNumber: 29,
      fileName: "index.js"
      activeBreakpoints : {},
      listBreakpoints : {},
      getBreakpoints: {}
    }
  }
  
  get lineNumber(){
    return this.state.lineNumber;
  }

  get fileName(){
    return this.state.fileName;
  }

  set lineNumber(value: number){
    this.setState({lineNumber: value});
  }

  set fileName(value: string){
    this.setState({fileName: value});
  }


  async createBreakPoint(fileName: string, lineNumber: number){
    const response = await new BackgroundRequest.SetBreakpointRequest().run(new BackgroundRequest.SetBreakpointRequestData(this.state.debuggeeId,fileName,lineNumber))
    var newStateActive = {...this.state.activeBreakpoints};
    newStateActive[response.breakpoint.id] = response.breakpoint;
    this.setState({activeBreakpoints: newStateActive});
  }

  componentDidMount(){
    var waitToken = null;
    setInterval(async function(){
      let listBreakpointResponse = await new BackgroundRequest.ListBreakPointsRequest().run(new BackgroundRequest.ListBreakpointsData(this.state.debuggeeId,waitToken))
      waitToken = listBreakpointResponse.nextWaitToken
      var newStateList = this.state.listBreakpoints.slice();
      for (let i of listBreakpointResponse.breakpoints) {
        newStateList.push(i['id']);
      }
      this.setState({listBreakpoints: newStateList});

      let difference = {}
      for (let breakpoint of this.state.listBreakpoints) {
        if (breakpoint in this.state.activeBreakpoints) {
          difference.push(breakpoint);
        }
      }
      this.getBreakpoint(difference)
    }, 5000); 
  }

  async getBreakpoint(differenceBreakpoint: Array<any>){
    var newStateGetBP = this.state.getBreakpoints.slice();
    var removeBP = {...this.state.activeBreakpoints};
    for (let breakpointId of differenceBreakpoint) {
      const getBreakpointresponse = await new BackgroundRequest.FetchBreakpointRequest().run(new BackgroundRequest.FetchBreakpointRequestData(this.state.debuggeeId,breakpointId));
      newStateGetBP.push(getBreakpointresponse.breakpoint); 
      delete removeBP[breakpointId];
    }
    this.setState({getBreakpoints: newStateGetBP});
    this.setState({activeBreakpoints: removeBP});
  }
 

  render() {
    return (
      <>
        <Chathead
          projectId={this.state.projectId}
          debuggeeId={this.state.debuggeeId}
          breakpoints={this.state.breakpoints}
          setProject={projectId => this.setState({projectId})}
          setDebuggee={debuggeeId => this.setState({debuggeeId})}
          createBreakpoint={(fileName, lineNumber) => this.createBreakPoint(fileName, lineNumber)}
        />
        {/* <p>Create a Break Point</p>
        <Input placeholder="File Name " />
        <Input placeholder="Line Number " />
        <Button primary onClick={this.createBreakPoint(this.state.lineNumber)}> CREATE </Button> */}
      </>
    );
  }

}

// Mounts injected App once html is loaded
const mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.render(<InjectedApp />, mount);
