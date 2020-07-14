import React from "react";
import styled from "styled-components";
import { SelectProjectContainer } from "./SelectProject";
import { SelectDebuggeeContainer } from "./SelectDebuggee";
import { CreateBreakpointForm } from "./CreateBreakpointForm";
import { FetchProjectsRequest, FetchProjectsRequestData, FetchDebuggeesRequestData, FetchDebuggeesRequest} from "../../common/requests/BackgroundRequest";
import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import { PendingBreakpointView, CompletedBreakpointView } from "./BreakpointView";

import Paper from "@material-ui/core/Paper";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
if(process.env.NODE_ENV !== "test"){
  import("fontsource-roboto");
}
interface ChatheadProps {
  /** The current selected project. Undefined if no project selected. */
  projectId: string | undefined;
  /** The current selected debuggee. Undefined if no debuggee selected. */
  debuggeeId: string | undefined;
  /** Breakpoints that have been set but not hit. */
  activeBreakpoints: BreakpointMeta[];
  /** Breakpoints that have been hit, with all data loaded. */
  completedBreakpoints: Breakpoint[];

  setProject: (projectId: string) => void;
  setDebuggee: (debuggeeId: string) => void;
  createBreakpoint: (fileName: string, lineNumber: number) => void;
}

interface ChatheadState {}

export class Chathead extends React.Component<ChatheadProps, ChatheadState> {
  constructor(props: ChatheadProps) {
    super(props);
  }

  render() {
    const {projectId, debuggeeId} = this.props;
    return (
      <ChatheadWrapper>
        {!projectId && (
          <SelectProjectContainer
            projectId={this.props.projectId}
            onChange={this.props.setProject}
            loadProjects={async () => {
              const response = await new FetchProjectsRequest().run(new FetchProjectsRequestData());
              return response.projects;
            }}
          />
        )}
        {projectId && !debuggeeId && (
          <SelectDebuggeeContainer
            projectId={this.props.projectId}
            debuggeeId={this.props.debuggeeId}
            onChange={this.props.setDebuggee}
            loadDebuggees={async () => {
              const response = await new FetchDebuggeesRequest().run(new FetchDebuggeesRequestData(this.props.projectId));
              // Response.debuggees will be undefined if there are no active debuggees.
              return response.debuggees || [];
            }}
          />
        )}
        {projectId && debuggeeId && (
          <>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6">Breakpoints</Typography>
              </Toolbar>
            </AppBar>
            <CreateBreakpointForm createBreakpoint={this.props.createBreakpoint}/>
          </>
        )}

        {
          this.props.activeBreakpoints.map(b => <PendingBreakpointView breakpointMeta={b}/>)
        }

        {
          this.props.completedBreakpoints.map(b => <CompletedBreakpointView breakpoint={b}/>)
        }
      </ChatheadWrapper>
    );
  }
}

const ChatheadWrapper = styled(Paper)`
  position: fixed;
  top: 20px;

  right: 20px;
  width: 300px;

  z-index: 1000;
`;
