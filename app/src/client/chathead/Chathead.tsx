import React from "react";
import styled from "styled-components";

export const Test = () => <div>Test</div>;

interface ChatheadProps {
    /** The current selected project. Undefined if no project selected. */
    projectId: string | undefined;
    /** The current selected debuggee. Undefined if no debuggee selected. */
    debuggeeId: string | undefined;
    breakpoints: any[]; // TODO: Create a Breakpoint type

    createBreakpoint: (lineNumber: number) => void;
}

interface ChatheadState {
    /** All projects this user has access to, loaded using FetchProjectsRequest */
    projects: any[]; // TODO: Create a Project type
    projectsLoading: boolean;

    /** All debuggees for the current project, loaded using FetchDebuggeesRequest */
    debuggees: any[]; // TODO: Create a Debuggee type,
    debuggeesLoading: boolean;
}

export class Chathead extends React.Component<ChatheadProps, ChatheadState> {
    constructor(props: ChatheadProps) {
        super(props);
        this.state = {
            projects: [],
            projectsLoading: false,

            debuggees: [],
            debuggeesLoading: false
        }
    }

    render() {
        return (
            <ChatheadWrapper>
            </ChatheadWrapper>
        )
    }
}

const ChatheadWrapper = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;

    padding: 20px;

    box-shadow: 0px 2px 8px 0px rgba(20, 20, 20, 0.4);
`;