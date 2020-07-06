import api from "debugger-extension-api";
import {
  BackgroundRequestType,
  BackgroundRequestData,
} from "../common/requests/BackgroundRequest";

class BackgroundRequestHandler {
  static handlers = {};

  static on<D extends BackgroundRequestData>(
    type: BackgroundRequestType,
    callback: (data: D) => Promise<any>
  ) {
    BackgroundRequestHandler.handlers[type] = callback;
  }

  static listen() {
    chrome.runtime.onMessage.addListener(
      async (data: BackgroundRequestData, sender, sendResponse) => {
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

BackgroundRequestHandler.on<FetchProjectsRequestData>(
  BackgroundRequestType.FETCH_PROJECT,
  async (data) => {
    const response = await api.fetchProjects();
    return response;
  }
);

BackgroundRequestHandler.on<FetchDebuggeesRequestData>(
  BackgroundRequestType.FETCH_DEBUGGEES,
  async (data) => {
    const response = await api.fetchDebuggees(data.projectId);
    return response;
  }
);

BackgroundRequestHandler.on<SetBreakpointRequestData>(
  BackgroundRequestType.SET_BREAKPOINT,
  async (data) => {
    const response = await api.setBreakpoint(
      data.debuggeeId,
      data.fileName,
      data.lineNumber
    );
    return response;
  }
);

BackgroundRequestHandler.on<FetchBreakpointRequestData>(
  BackgroundRequestType.FETCH_BREAKPOINT,
  async (data) => {
    const response = await api.getBreakpoint(
      data.debuggeeId,
      data.breakpointId
    );
    return response;
  }
);

BackgroundRequestHandler.on<ListBreakpointsData>(
  BackgroundRequestType.LIST_BREAKPOINTS,
  async (data) => {
    const response = await api.fetchDebuggees(data.debuggeeId);
    return response;
  }
);
