import React from "react";
import styled from "styled-components";
import { SelectProjectContainer } from "./SelectProject";
import { SelectDebugeeContainer } from "./SelectDebugee";
import { CreateBreakpointForm } from "./CreateBreakpointForm";

interface ChatheadProps {
  /** The current selected project. Undefined if no project selected. */
  projectId: string | undefined;
  /** The current selected debuggee. Undefined if no debuggee selected. */
  debuggeeId: string | undefined;
  breakpoints: any[]; // TODO: Create a Breakpoint type

  setProject: (projectId: string) => void;
  setDebugee: (debugeeId: string) => void;
  createBreakpoint: (fileName: string, lineNumber: number) => void;
}

interface ChatheadState {
  /** All debuggees for the current project, loaded using FetchDebuggeesRequest */
  debuggees: any[]; // TODO: Create a Debuggee type,
  debuggeesLoading: boolean;
}

export class Chathead extends React.Component<ChatheadProps, ChatheadState> {
  constructor(props: ChatheadProps) {
    super(props);
    this.state = {
      debuggees: [],
      debuggeesLoading: false,
    };
  }

  render() {
    const {projectId, debuggeeId} = this.props;
    return (
      <ChatheadWrapper>
        {!projectId && (
          <SelectProjectContainer
            projectId={this.props.projectId}
            onChange={this.props.setProject}
            loadProjects={async () => ["a", "b", "c"]}
          />
        )}
        {projectId && !debuggeeId && (
          <SelectDebugeeContainer
            projectId={this.props.projectId}
            debugeeId={this.props.debuggeeId}
            onChange={this.props.setDebugee}
            loadDebugees={async () => ["a", "b", "c"]}
          />
        )}
        {projectId && debuggeeId && (
          <CreateBreakpointForm createBreakpoint={this.props.createBreakpoint}/>
        )}
      </ChatheadWrapper>
    );
  }
}

const ChatheadWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;

  width: 200px;

  padding: 20px;

  background: white;
  box-shadow: 0px 2px 8px 0px rgba(20, 20, 20, 0.4);
  z-index: 10000;
`;