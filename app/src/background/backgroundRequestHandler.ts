import api from "debugger-extension-api";
import * as backgroundRequest from "../common/requests/BackgroundRequest";
import * as serviceUsageHandler from "./serviceUsageHandler";
import * as extensionAuthHandler from "./extensionAuthHandler";

/** A MessageEmitter is a source of incoming messages.
 * In prod, this is likely an abstraction over the chrome.runtime.onMessage.addListener method.
 * We abstract this so that for testing, a mock implementation can be used with the same forward API.
 */
export type MessageEmitter = {
  // Called internally by BackgroundRequestHandler to 'connect' to the firehose.
  register: (handler: MessageHandler) => void
}

/**
 * A callback to recieve messages from a MessageEmitter.
 * In practice, handlers to emitters are 1:1, again, this abstraction is
 * primarily to allow mocking.
 */
export type MessageHandler = (
  // An incoming request data
  data: backgroundRequest.BackgroundRequestData,
  // Which tab is sending the data, for now, this is ignored. 
  sender: any,
  // A callback to send data back in response.
  sendResponse: (response: backgroundRequest.BackgroundRequestResponse<any>) => void
) => void;

/** A handler for messages of a given type.
 * For example, all FETCH_PROJECTS messages will have a designated RequestHandler.
 */
export type RequestHandler<D extends backgroundRequest.BackgroundRequestData> = (data: D) => Promise<any>;

/**
 * BackgroundRequestHandler receives chrome runtime messages (i.e. BackgroundRequestData) and it
 * dispatches them to the handlers based on their type (BackgroundRequestType) field.
 * These handlers will perform  logic usually by calling (and awaiting) debugger-extension API methods.
 */
export class BackgroundRequestHandler {
  // Dictionary to keep the handlers and their callback
  private handlers = new Map<backgroundRequest.BackgroundRequestType, RequestHandler<any>>();
  // A source of incoming messages. This can be either the built in chrome message passing or manual mocks.
  private messageEmitter: MessageEmitter;

  /**
   * 
   * @param messageEmitter The source of all incoming messages.
   */
  constructor(messageEmitter: MessageEmitter) {
    this.messageEmitter = messageEmitter;
  }

  /** Register a listener to map all requests of a given type to a particular handler. */
  on<D extends backgroundRequest.BackgroundRequestData>(
    type: backgroundRequest.BackgroundRequestType,
    handler: RequestHandler<D>
  ) {
    this.handlers.set(type, handler);
  }

  /**
   * Static function to match the handler based on their BackgroundRequest type and send the response
   * back to the request using chrome.runtime.onMessage.addListener(function callback)
   */
  listen() {
    // Registering lets the messageEmitter forward all events to this primary callback.
    this.messageEmitter.register(
      (data: backgroundRequest.BackgroundRequestData, sender, sendResponse) => {
        if (!this.handlers.has(data.type)) {
          throw new Error("Handler not registered for type: " + data.type);
        }
        const handler = this.handlers.get(data.type) as RequestHandler<any>;
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

if (window.chrome) {
  const backgroundRequestHandler: BackgroundRequestHandler = new BackgroundRequestHandler({
    register: window.chrome.runtime.onMessage.addListener
  });

  /**
   * Handler for fetching the project from debugger-extension api and return the response.
   */
  backgroundRequestHandler.on<backgroundRequest.FetchProjectsRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.FetchDebuggeesRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.SetBreakpointRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.FetchBreakpointRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.ListBreakpointsData>(
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
  backgroundRequestHandler.on<backgroundRequest.DeleteBreakpointRequestData>(
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
  backgroundRequestHandler.on<
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
  backgroundRequestHandler.on<backgroundRequest.EnableRequiredServiceRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.GetAuthStateRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.AuthenticationRequestData>(
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
  backgroundRequestHandler.on<backgroundRequest.UserInfoRequestData>(
    backgroundRequest.BackgroundRequestType.USER_INFO,
    async () => {
      try {
        const response = await api.getUserInfo();
        const data = {userName: response.name, userEmail: response.email, userPicture: response.picture }
        return data;
      } catch (error) {
        throw { message: error.message };
      }
    }
  );

}

