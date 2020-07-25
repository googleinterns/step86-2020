import api from "debugger-extension-api";
import * as backgroundRequest from "../common/requests/BackgroundRequest";
import * as serviceUsageHandler from "./serviceUsageHandler";
import * as extensionAuthHandler from "./extensionAuthHandler";

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
        handler(data)
          .then((data) => {
            const response = backgroundRequest.BackgroundRequestResponseFactory.fromData(
              data
            );
            sendResponse(response);
          })
          .catch((data) => {
            const error = backgroundRequest.BackgroundRequestResponseFactory.fromError(
              data
            );
            sendResponse(error);
          });
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
    try {
      const response = await api.fetchProjects();
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for fetching the debuggees from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.FetchDebuggeesRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_DEBUGGEES,
  async (data) => {
    try {
      const response = await api.fetchDebuggees(data.projectId);
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for setting the breakpoints using debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.SetBreakpointRequestData>(
  backgroundRequest.BackgroundRequestType.SET_BREAKPOINT,
  async (data) => {
    try {
      const response = await api.setBreakpoint(
        data.debuggeeId,
        data.fileName,
        data.lineNumber,
        data.condition,
        data.expressions
      );
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for fetching the breakpoints from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.FetchBreakpointRequestData>(
  backgroundRequest.BackgroundRequestType.FETCH_BREAKPOINT,
  async (data) => {
    try {
      const response = await api.getBreakpoint(
        data.debuggeeId,
        data.breakpointId
      );
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for listing the breakpoints from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.ListBreakpointsData>(
  backgroundRequest.BackgroundRequestType.LIST_BREAKPOINTS,
  async (data) => {
    try {
      const response = await api.listBreakpoints(data.debuggeeId);
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for delete the breakpoint from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.DeleteBreakpointRequestData>(
  backgroundRequest.BackgroundRequestType.DELETE_BREAKPOINT,
  async (data) => {
    try {
      const response = await api.deleteBreakpoint(
        data.debuggeeId,
        data.breakpointId
      );
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler to get all the enabled services and return the response.
 */
BackgroundRequestHandler.on<
  backgroundRequest.RequiredServicesEnabledRequestData
>(backgroundRequest.BackgroundRequestType.IS_SERVICE_ENABLED, async (data) => {
  try {
    const request = await serviceUsageHandler.checkRequiredServices(
      data.projectNumber
    );
    return { isRequiredServicesEnabled: request };
  } catch (error) {
    throw { message: error.message };
  }
});

/**
 * Handler for enable the required services.
 */
BackgroundRequestHandler.on<backgroundRequest.EnableRequiredServiceRequestData>(
  backgroundRequest.BackgroundRequestType.ENABLE_REQUIRED_SERVICE,
  async (data) => {
    try {
      serviceUsageHandler.enableRequiredService(data.projectNumber);
    } catch (error) {
      throw { message: error.message };
    }
  }
);

/**
 * Handler for Request if user is authenticated by checking from debugger-extension.
 */
BackgroundRequestHandler.on<backgroundRequest.GetAuthStateRequestData>(
  backgroundRequest.BackgroundRequestType.IS_AUTHENTICATED,
  async () => {
    const request = await api.getAuthToken();
    let response = { isAuthenticated: false };
    if (request !== "") {
      response = { isAuthenticated: true };
    }
    return response;
  }
);

/**
 * Handler for Request the token from extensionAuthHandler.
 */
BackgroundRequestHandler.on<backgroundRequest.AuthenticationRequestData>(
  backgroundRequest.BackgroundRequestType.AUTHENTICATION,
  async () => {
    await extensionAuthHandler.getToken();
    setInterval(() => {
      extensionAuthHandler.getToken();
    }, 5 * 60 * 1000);
    return {};
  }
);

/**
 * Handler for fetching the User information from debugger-extension api and return the response.
 */
BackgroundRequestHandler.on<backgroundRequest.UserInfoRequestData>(
  backgroundRequest.BackgroundRequestType.USER_INFO,
  async () => {
    try {
      const response = await api.getUserInfo();
      return response;
    } catch (error) {
      throw { message: error.message };
    }
  }
);