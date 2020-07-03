import React from "react";

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
    /** All debuggees for the current project, loaded using FetchDebuggeesRequest */
    debuggees: any[]; // TODO: Create a Debuggee type
}
