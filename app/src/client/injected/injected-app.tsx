import React from "react";
import ReactDOM from "react-dom";
import { Chathead } from "../chathead/Chathead";
import * as backgroundRequest from "../../common/requests/BackgroundRequest";
import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import { BreakpointMarkers } from "../markers/BreakpointMarkers";
import { WindowSize, WindowSizeContext } from "../chathead/windowSizeContext";
import { AuthPopup } from "../popup/AuthPopup";
import {
  GetAuthStateRequest,
  GetAuthStateRequestData,
} from "../../common/requests/BackgroundRequest";

interface InjectedAppState {
  projectId: string;
  debuggeeId: string;
  isAuthenticated: boolean;

  activeBreakpoints: { [key: string]: BreakpointMeta };
  completedBreakpoints: { [key: string]: Breakpoint };

  localStorage?: Storage;
  windowSize: WindowSize;
}

interface InjectedAppProps {
  // Explicitly take in a collection of background requests to allow mocking.
  backgroundRequest?: typeof backgroundRequest;
}

export class InjectedApp extends React.Component<InjectedAppProps, InjectedAppState> {
  public static defaultProps = {
    backgroundRequest: backgroundRequest
  }

  constructor(props: InjectedAppProps) {
    super(props);
    this.state = {
      projectId: this.getGcpProjectId(),
      debuggeeId: undefined,
      isAuthenticated: false,

      activeBreakpoints: {},
      completedBreakpoints: {},
      windowSize: WindowSize.REGULAR
    };
  }

  /**
   * This function fetches projects names on Github and return the title of the project
   */
  getProjectNameFromGithub(): string {
    let title = document.querySelector(".js-path-segment:first-child");
    if (title !== null) {
      var projectName = title.innerText;
      return projectName;
    }
  }

  /**
   * This function checks of the project name already exists in the local storage
   */
  getGcpProjectId(): string {
    let gcpProjectId = localStorage.getItem(this.getProjectNameFromGithub());
    return gcpProjectId !== null ? gcpProjectId : undefined;
  }

  /** Saves the current project name - project id association (if possible) */
  saveGcpProjectId(projectId: string): void {
    const projectName = this.getProjectNameFromGithub();
    // Only save if we're able to pull the project name.
    if (projectName) {
      // Save new project ID only if there is a projectId.
      // Otherwise, localStorage saves the string "undefined" which throws things off.
      if (projectId) {
        this.getLocalStorage().setItem(projectName, projectId);
      } else {
        // In the undefined case, manually remove the saved project.
        this.getLocalStorage().removeItem(projectName);
      }
    }
  }

  /**
   * Makes request to the BackgroundRequest to set the breakpoint
   * using debuggee id, file name and line number
   * @param {String} filename Name of the file to set the breakpoint in that file.
   * @param {number} lineNumber line number to set the breakpoint on that line.
   */
  async createBreakPoint(fileName: string, lineNumber: number, condition: string = "", expressions: string[] = []) {
    // Make the Set breakpoint request in the BackgroundRequest
    const response = await new this.props.backgroundRequest.SetBreakpointRequest().run(
      new this.props.backgroundRequest.SetBreakpointRequestData(
        this.state.debuggeeId,
        fileName,
        lineNumber,
        condition,
        expressions
      )
    );
    /**
     * Side note: you cannot mutate the state variable in React. So, to append (add) values to an array, you have to
     * make a temporary copy of state array and push elements to it. And then reassign the state variable
     */
    // Add the response to the state object variable
    var tempActiveBreakpoint = { ...this.state.activeBreakpoints };
    tempActiveBreakpoint[response.breakpoint.id] = response.breakpoint;
    this.setState({ activeBreakpoints: tempActiveBreakpoint });
  }

  /**
   * This function is invoked immediately after a component is mounted. This allows to
   * keep calling listbreakpoints request on an interval of 5 seconds to check
   * the difference between active breakpoints and non-active breakpoints.
   */
  componentDidMount() {
    // Set waitToken to null as default for first call
    var waitToken = null;
    // Checks if debuggeeId is not undefined
    setInterval(async () => {
      if (
        this.state.debuggeeId !== undefined &&
        Object.keys(this.state.activeBreakpoints).length > 0
      ) {
        // Make the list breakpoint request
        let breakpointListResponse = await new this.props.backgroundRequest.ListBreakPointsRequest().run(
          new this.props.backgroundRequest.ListBreakpointsData(
            this.state.debuggeeId,
            waitToken
          )
        );
        waitToken = breakpointListResponse.nextWaitToken;

        let breakpointList: Array<any> = [];
        // Add the active breakpoints to the listBreakpoint state array.
        for (let breakpoint of breakpointListResponse.breakpoints || []) {
          breakpointList.push(breakpoint["id"]);
        }

        // Get the inactive breakpoints (by getting difference from activeBreakpoint and breakpointList) array
        let inactiveBreakpoints: Array<any> = [];
        for (let breakpointId in this.state.activeBreakpoints) {
          if (!breakpointList.includes(breakpointId)) {
            inactiveBreakpoints.push(breakpointId);
          }
        }

        // Call function to get the breakpoint data sending non-active breakpoints.
        this.loadBreakpoints(inactiveBreakpoints);
      }
      this.getAuthState();
    }, 5000);
  }

  /** Deletes a breakpoint from debugger backend. */
  async deleteBreakpoint(breakpointId: string) {
    // Delete the breakpoint from remote cloud debugger.
    const deleteBreakpointRequest = await new this.props.backgroundRequest.DeleteBreakpointRequest().run(
      new this.props.backgroundRequest.DeleteBreakpointRequestData(
        this.state.debuggeeId,
        breakpointId
      )
    );
    // Remove breakpoint from local tracking.
    const updatedCompletedBreakpoints = { ...this.state.completedBreakpoints };
    const updatedActiveBreakpoints = { ...this.state.activeBreakpoints };
    delete updatedCompletedBreakpoints[breakpointId];
    delete updatedActiveBreakpoints[breakpointId];
    this.setState({ completedBreakpoints: updatedCompletedBreakpoints, activeBreakpoints: updatedActiveBreakpoints });
  }

  /**
   * This function gets the data of non-active breakpoints (breakpoint that are hit)
   * and saves it to the getBreakpoint state array. Moreover removes it from active breakpoint array.
   * @param {Array<any>} differenceBreakpoint list of non-active breakpoints.
   */
  async loadBreakpoints(breakpointIdsToLoad: Array<any>) {
    // Make request to get the breakpoint data using breakpoint ids
    var tempGetBreakpoints = { ...this.state.completedBreakpoints };
    var updatedActiveBPs = { ...this.state.activeBreakpoints };
    for (let breakpointId of breakpointIdsToLoad) {
      const getBreakpointresponse = await new this.props.backgroundRequest.FetchBreakpointRequest().run(
        new this.props.backgroundRequest.FetchBreakpointRequestData(
          this.state.debuggeeId,
          breakpointId
        )
      );
      // Add it to the state array for getBreakpoint data
      const { breakpoint } = getBreakpointresponse;
      tempGetBreakpoints[breakpoint.id] = breakpoint;
      // Remove the breakpoint from the active breakpoint list
      delete updatedActiveBPs[breakpointId];
    }
    this.setState({ completedBreakpoints: tempGetBreakpoints });
    this.setState({ activeBreakpoints: updatedActiveBPs });
  }
  /**
   * Delete a batch of active breakpoints from debugger backend
   */
  async deleteAllActiveBreakpoints() {
    //delete all active breakpoints from remote cloud debugger.
    for (let breakpointId of Object.values(this.state.activeBreakpoints)) {
      const deletionRequest = await new this.props.backgroundRequest.DeleteBreakpointRequest().run(
        new this.props.backgroundRequest.DeleteBreakpointRequestData(
          this.state.debuggeeId,
          breakpointId.id
        )
      );
    }
    this.setState({ completedBreakpoints: {} });
    this.setState({ activeBreakpoints: {} });
  }

  /** Set the chathead window size. */
  setWindowSize(windowSize: WindowSize) {
    this.setState({windowSize});
  }

  /**
   *  get authentication state by making a call to backend requests
   */
  async getAuthState() {
    const response = await new GetAuthStateRequest().run(
      new GetAuthStateRequestData()
    );
    this.setState({ isAuthenticated: response.isAuthenticated });
  }

  render() {
    /** Active and completed breakpoints are kept in state differently because active breakpoints must be deletable.
     *  However, as far as UI is concerned, they are both lists. This conversion helps simplify markup.
     */
    const activeBreakpoints = Object.values(this.state.activeBreakpoints);
    const completedBreakpoints = Object.values(this.state.completedBreakpoints);
    if (this.state.isAuthenticated) {
      return (
        <WindowSizeContext.Provider value={{size: this.state.windowSize, setSize: windowSize => this.setWindowSize(windowSize)}}>
          <Chathead
            projectId={this.state.projectId}
            debuggeeId={this.state.debuggeeId}
            activeBreakpoints={activeBreakpoints}
            completedBreakpoints={completedBreakpoints}
            setProject={(projectId) => {
              localStorage.setItem(this.getProjectNameFromGithub(), projectId);
              this.setState({ projectId });
            }}
            setDebuggee={(debuggeeId) => this.setState({ debuggeeId })}
            createBreakpoint={(fileName, lineNumber) =>
              this.createBreakPoint(fileName, lineNumber)
            }
            deleteBreakpoint={(breakpointId: string) =>
              this.deleteBreakpoint(breakpointId)
            }
            deleteAllActiveBreakpoints={() => this.deleteAllActiveBreakpoints()}
          />

          <BreakpointMarkers
            activeBreakpoints={activeBreakpoints}
            completedBreakpoints={completedBreakpoints}
            createBreakpoint={(fileName, lineNumber) => {
              // The marker may be clicked when the chathead is closed.
              // It's a reasonable assumption that it should be open.
              this.setWindowSize(WindowSize.REGULAR);
              this.createBreakPoint(fileName, lineNumber)
            }}
          />
        </WindowSizeContext.Provider>
      );
    } else {
      return null;
    }
  }

  /** Get the windows local storage object. This accepts a prop to allow mocks. */
  getLocalStorage() {
    return this.props.localStorage || window.localStorage;
  }
}

// Mounts injected App once html is loaded
const mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.render(<InjectedApp />, mount);
