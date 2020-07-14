import api from "debugger-extension-api";
import * as backgroundRequest from "../common/requests/BackgroundRequest";
import * as serviceUsageHandler from "./serviceUsageHandler";


/**
 * BackgroundRequestHandler receives chrome runtime messages (i.e. BackgroundRequestData) and it
 * dispatches them to the handlers based on their type (BackgroundRequestType) field.
 * These handlers will perform  logic usually by calling (and awaiting) debugger-extension API methods.
 */
export class BackgroundRequestHandler {
  // Dictionary to keep the handlers and their callback
  static handlers = {};

  static on<D extends backgroundRequest.BackgroundRequestData>(
    type: backgroundRequest.BackgroundRequestType,
    callback: (data: D) => Promise<any>
  ) {
    BackgroundRequestHandler.handlers[type] = callback;
  }

  /**
   * Static function to match the handler based on their BackgroundRequest type and send the response
   * back to the request using chrome.runtime.onMessage.addListener(function callback)
   */
  static listen() {
    chrome.runtime.onMessage.addListener(
      (data: backgroundRequest.BackgroundRequestData, sender, sendResponse) => {
        const handler = BackgroundRequestHandler.handlers[data.type];
        if (handler === undefined) {
          throw new Error("Handler not registered for type: " + data.type);
        }
        handler(data).then(sendResponse);
        // Need to return true to tell chrome to wait for a response.
        return true;
      }
    );
  }
}

/**
 * Handler for fetching the project from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.FetchProjectsRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_PROJECTS,
  async (data) => {
    const response = await api.fetchProjects();
    return response;
  }
);

/**
 * Handler for fetching the debuggees from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.FetchDebuggeesRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_DEBUGGEES,
  async (data) => {
    const response = await api.fetchDebuggees(data.projectId);
    return response;
  }
);

/**
 * Handler for setting the breakpoints using debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.SetBreakpointRequestData>(
  backgroundRequest.BackgroundRequestType.SET_BREAKPOINT,
  async (data) => {
    const response = await api.setBreakpoint(
      data.debuggeeId,
      data.fileName,
      data.lineNumber
    );
    return response;
  }
);

/**
 * Handler for fetching the breakpoints from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.FetchBreakpointRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_BREAKPOINT,
  async (data) => {
    const response = await api.getBreakpoint(
      data.debuggeeId,
      data.breakpointId
    );
    return response;
  }
);

/**
 * Handler for listing the breakpoints from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.ListBreakpointsData>(
  backgroundRequest.BackgroundRequestType.LIST_BREAKPOINTS,
  async (data) => {
    const response = await api.listBreakpoints(data.debuggeeId);
    return response;
  }
);

/**
 * Handler for delete the breakpoint from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.RequiredServicesEnabledRequestData>(
  backgroundRequest.BackgroundRequestType.IS_SERVICE_ENABLED,
  async (data) => {
    const request = await serviceUsageHandler.checkRequiredServices(data.projectNumber);
    return { isRequiredServicesEnabled: request}
  }
);
