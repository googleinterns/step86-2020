import api from "debugger-extension-api";
import * as backgroundRequest from "../common/requests/BackgroundRequest";

class BackgroundRequestHandler {
  static handlers = {};

  static on<D extends backgroundRequest.BackgroundRequestData>(
    type: backgroundRequest.BackgroundRequestType,
    callback: (data: D) => Promise<any>
  ) {
    backgroundRequest.BackgroundRequestHandler.handlers[type] = callback;
  }

  static listen() {
    chrome.runtime.onMessage.addListener(
      async (data: backgroundRequest.BackgroundRequestData, sender, sendResponse) => {
        const handler = BackgroundRequestHandler.handlers[data.type];
        if (handler === undefined) {
          throw new Error("Handler not registered for type: " + data.type);
        }
        const response = await handler(data);
        sendResponse(response);
      }
    );
  }
}

BackgroundRequestHandler.on<backgroundRequest.FetchProjectsRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_PROJECTS,
  async (data) => {
    const response = await api.fetchProjects();
    return response;
  }
);

BackgroundRequestHandler.on<backgroundRequest.FetchDebuggeesRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_DEBUGGEES,
  async (data) => {
    const response = await api.fetchDebuggees(data.projectId);
    return response;
  }
);

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

BackgroundRequestHandler.on<backgroundRequest.ListBreakpointsData>(
  backgroundRequest.BackgroundRequestType.LIST_BREAKPOINTS,
  async (data) => {
    const response = await api.fetchDebuggees(data.debuggeeId);
    return response;
  }
);
