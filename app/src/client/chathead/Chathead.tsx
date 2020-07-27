import React from "react";
import styled, {css} from "styled-components";
import { SelectProjectContainer } from "./SelectProject";
import { SelectDebuggeeContainer } from "./SelectDebuggee";
import { CreateBreakpointForm } from "./CreateBreakpointForm";
import {
  FetchProjectsRequest,
  FetchProjectsRequestData,
  FetchDebuggeesRequestData,
  FetchDebuggeesRequest,
} from "../../common/requests/BackgroundRequest";
import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import {
  PendingBreakpointView,
  CompletedBreakpointView,
} from "./BreakpointView";
import Demo from './Tutorial';

import Paper from "@material-ui/core/Paper";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// Jest has trouble with this, so only import in actual builds.
if (process.env.NODE_ENV !== "test") {
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
  createBreakpoint: (fileName: string, lineNumber: number, condition: string, expressions: string[]) => void;
  deleteBreakpoint: (breakpointId: string) => void;
  deleteAllActiveBreakpoints: () => void;
}

interface ChatheadState {
  minimized: boolean;
  maximized: boolean;
}

export class Chathead extends React.Component<ChatheadProps, ChatheadState> {
  constructor(props: ChatheadProps) {
    super(props);
    this.state = {
      minimized: false
    }
  }

  toggleMinimized() {
    this.setState({minimized: !this.state.minimized, maximized: false});
  }

  toggleMaximized() {
    this.setState({maximized: !this.state.maximized});
  }

  render() {
    const { projectId, debuggeeId } = this.props;
    const { minimized, maximized} = this.state;
    return (
      <ChatheadWrapper minimized={minimized} maximized={maximized} onClick={() => minimized && this.toggleMinimized()}>
        {minimized && <CloudLogo src="https://pbs.twimg.com/profile_images/1105378972156649472/9W16lxHj_400x400.png"/>}
        {!minimized && !projectId && (
          <SelectProjectContainer
            projectId={this.props.projectId}
            projectDescription={this.props.projectDescription}
            onChange={this.props.setProject}
            loadProjects={async () => {
              const response = await new FetchProjectsRequest().run(
                new FetchProjectsRequestData()
              );
              return response.projects;
            }}
            toggleMinimized={() => this.toggleMinimized()}
            toggleMaximized={() => this.toggleMaximized()}
          />
        )}

        {!minimized && projectId && !debuggeeId && (
          <SelectDebuggeeContainer
            projectId={this.props.projectId}
            debuggeeId={this.props.debuggeeId}
            onChange={this.props.setDebuggee}
            loadDebuggees={async () => {
              const response = await new FetchDebuggeesRequest().run(
                new FetchDebuggeesRequestData(this.props.projectId)
              );
              // Response.debuggees will be undefined if there are no active debuggees.
              return response.debuggees || [];
            }}
            backToProjects={() => {
              this.props.setProject(undefined);
            }}
          />
        )}

        {!minimized && projectId && debuggeeId && (
          <>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => this.props.setDebuggee(undefined)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">Breakpoints</Typography>
              </Toolbar>
            </AppBar>
            <CreateBreakpointForm activeBreakpoints={this.props.activeBreakpoints} completedBreakpoints={this.props.completedBreakpoints}  deleteAllActiveBreakpoints={this.props.deleteAllActiveBreakpoints} createBreakpoint={this.props.createBreakpoint}/>
          </>
        )}
        {
          <>
          <Demo />
          </>
        }

        {!minimized && this.props.activeBreakpoints.map((b) => (
          <PendingBreakpointView breakpointMeta={b} deleteBreakpoint={this.props.deleteBreakpoint}/>
        ))}

        {!minimized && this.props.completedBreakpoints.map((b) => (
          <CompletedBreakpointView
            breakpoint={b}
            deleteBreakpoint={this.props.deleteBreakpoint}
          />
        ))}
      </ChatheadWrapper>
    );
  }
}

const ChatheadWrapper = styled(Paper)`
  position: fixed;
  top: 20px;

  right: 20px;
  width: 600px;
  min-height: 300px;
  max-height: calc(100% - 40px);
  overflow: auto;

  z-index: 1000;

  transition: all 0.4s !important;

  ${props => props.minimized && css`
    width: 60px;
    min-height: 60px;
    border-radius: 30px !important;
  `}

  ${props => props.maximized && css`
    width: calc(100% - 40px);
    min-height: calc(100% - 40px);
    top: 20px;
    right: 20px;
  `}
`;

const CloudLogo = styled.img`
  height: 50px;
  margin-top: 5px;
  margin-left: 5px;
`;
