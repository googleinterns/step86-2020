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
  completedBreakpointsList: Array<any>;

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
      completedBreakpointsList: []
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

    /**
   * Makes request to the BackgroundRequest to set the breakpoint 
   * using debuggee id, file name and line number
   * @param {String} filename Name of the file to set the breakpoint in that file.
   * @param {number} lineNumber line number to set the breakpoint on that line.
   */
  async createBreakPoint(fileName: string, lineNumber: number){
    // Make the Set breakpoint request in the BackgroundRequest 
    const response = await new BackgroundRequest.SetBreakpointRequest().run(new BackgroundRequest.SetBreakpointRequestData(this.state.debuggeeId,fileName,lineNumber))
  /**
   * Side note: you cannot mutate the state variable in React. So, to append (add) values to an array, you have to 
   * make a temporary copy of state array and push elements to it. And then reassign the state variable
   */
    // Add the response to the state object variable
    var tempActiveBreakpoint = {...this.state.activeBreakpoints};
    tempActiveBreakpoint[response.breakpoint.id] = response.breakpoint;
    this.setState({activeBreakpoints: tempActiveBreakpoint});
  }

    /**
   * This function is invoked immediately after a component is mounted. This allows to 
   * keep calling listbreakpoints request on an interval of 5 seconds to check 
   * the difference between active breakpoints and non-active breakpoints.
   */
  componentDidMount(){
    // Set waitToken to null as default for first call
    var waitToken = null;
    // Checks if debuggeeId is not undefined
      setInterval(async () => {
        if (this.state.debuggeeId !== undefined && Object.keys(this.state.activeBreakpoints).length > 0) {         
          // Make the list breakpoint request
          let breakpointListResponse = await new BackgroundRequest.ListBreakPointsRequest().run(new BackgroundRequest.ListBreakpointsData(this.state.debuggeeId,waitToken))
          waitToken = breakpointListResponse.nextWaitToken

          let breakpointList: Array<any> = [];
          // Add the active breakpoints to the listBreakpoint state array.
          for (let breakpoint of (breakpointListResponse.breakpoints || [])) {
            breakpointList.push(breakpoint['id']);
          }

          // Get the inactive breakpoints (by getting difference from activeBreakpoint and breakpointList) array
          let inactiveBreakpoints: Array<any> = [];
          for (let breakpointId in this.state.activeBreakpoints) {
            if (!(breakpointList.includes(breakpointId))) {
              inactiveBreakpoints.push(breakpointId);
            }
          }

          // Call function to get the breakpoint data sending non-active breakpoints.
          this.loadBreakpoints(inactiveBreakpoints)
        }
      }, 5000); 
  }
    
  /**
   * This function gets the data of non-active breakpoints (breakpoint that are hit) 
   * and saves it to the getBreakpoint state array. Moreover removes it from active breakpoint array.
   * @param {Array<any>} differenceBreakpoint list of non-active breakpoints.
   */
  async loadBreakpoints(breakpointIdsToLoad: Array<any>){
    // Make request to get the breakpoint data using breakpoint ids
    var tempGetBreakpoints = this.state.completedBreakpointsList.slice();
    var updatedActiveBPs = {...this.state.activeBreakpoints};
    for (let breakpointId of breakpointIdsToLoad) {
      const getBreakpointresponse = await new BackgroundRequest.FetchBreakpointRequest().run(new BackgroundRequest.FetchBreakpointRequestData(this.state.debuggeeId,breakpointId));
      // Add it to the state array for getBreakpoint data
      tempGetBreakpoints.push(getBreakpointresponse.breakpoint);
      // Remove the breakpoint from the active breakpoint list 
      delete updatedActiveBPs[breakpointId];
    }
    this.setState({completedBreakpointsList: tempGetBreakpoints});
    this.setState({activeBreakpoints: updatedActiveBPs});
  }
 

  render() {
    return (
      <>
        <Chathead
          projectId={this.state.projectId}
          debuggeeId={this.state.debuggeeId}
          activeBreakpoints={Object.values(this.state.activeBreakpoints)}
          completedBreakpoints={this.state.completedBreakpointsList}
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
