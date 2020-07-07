import React from "react";
import styled from "styled-components";
import { SelectProjectContainer } from "./SelectProject";
import { SelectDebuggeeContainer } from "./SelectDebuggee";
import { CreateBreakpointForm } from "./CreateBreakpointForm";
import { FetchProjectsRequest, FetchProjectsRequestData, FetchDebuggeesRequestData, FetchDebuggeesRequest} from "../../common/requests/BackgroundRequest";

interface ChatheadProps {
  /** The current selected project. Undefined if no project selected. */
  projectId: string | undefined;
  /** The current selected debuggee. Undefined if no debuggee selected. */
  debuggeeId: string | undefined;
  breakpoints: any[]; // TODO: Create a Breakpoint type

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
            loadProjects={() => new FetchProjectsRequest().run(new FetchProjectsRequestData())}
          />
        )}
        {projectId && !debuggeeId && (
          <SelectDebuggeeContainer
            projectId={this.props.projectId}
            debuggeeId={this.props.debuggeeId}
            onChange={this.props.setDebuggee}
            loadDebuggees={() => new FetchDebuggeesRequest().run(new FetchDebuggeesRequestData(this.props.projectId))}
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
