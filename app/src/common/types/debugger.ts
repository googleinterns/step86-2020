/**
 * Typescript definitions for data returned by the debugger.
 */

 /** Used to represent breakpoints that have not yet completed. */
export interface BreakpointMeta {
    id: string;
    location: {
        path: string;
        line: number;
    };
    createTime: string;
    userEmail: string;
}

/** Used to represent breakpoints that have completed. */
export interface Breakpoint extends BreakpointMeta {
    isFinalState: boolean;
    stackFrames: Array<any>;
    variableTable: Array<any>;
    finalTime: string;
    labels: any;
}

/** A breakpoint that has completed with errors. */
export interface FailedBreakpoint extends Breakpoint {
  status: {
    isError: boolean;
    // Debugger returns the error message in the form of a bash style template string.
    // Example: format = "Hello $0", parameters = ["Bob"]
    description: {
      format: string;
      parameters: string[]
    }
  }
}

/* A single GCP project */
export interface Project {
    projectNumber: string;
    projectId: string;
    lifecycleState: string;
    name: string;
    createTime: string;
}

/** A single debuggee within a GCP project */
export interface Debuggee {
    id: string;
    project: string;
    uniquifier: string;
    description: string;
    agentVersion: string;
    sourceContext: Array<any>;
    labels: any;
}

/** A variable returned as part of a breakpoints stack frames. */
export interface Variable {
  name: string;
  type: string;
  value: string;
}