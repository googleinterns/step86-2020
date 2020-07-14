/**
 * Background Requests are used to communicate from UI to API, and await responses as needed.
 * Each type of request must extend BackgroundRequest (and associated BackgroundRequestData/Response).
 */

/**
 *  Each request must include a type field.
 *  This is used to coordinate requests between UI and API,
 *  and dispatch them to the correct handlers.
 */
export enum BackgroundRequestType {
  FETCH_PROJECTS,
  FETCH_DEBUGGEES,
  FETCH_BREAKPOINT,
  SET_BREAKPOINT,
  LIST_BREAKPOINTS,
  DELETE_BREAKPOINT,
  AUTHENTICATION,
  IS_AUTHENTICATED
}

/**
 * A standardized format for all background requests.
 * Each type of request must extend this with its required parameters.
 * 
 * @example <caption>Creating a new data type</caption>
 * ```
 * class MyData extends BackgroundRequestData {
 *   foo: string;
 *   constructor(foo: string) {
 *     super(BackgroundRequestType.MY_REQUEST)
 *     this.foo = foo;
 *   }
 * }
 * ```
 */
export abstract class BackgroundRequestData {
  /** Used for dispatching to correct handler. */
  type: BackgroundRequestType;

  constructor(type: BackgroundRequestType) {
    this.type = type;
  }
}

/** A response provided from the background. Only the data field will actually be returned to UI.
 * This class exists to allow detection of an error and subsequent promise rejection.
 * Since we're using chrome message passing, error from background won't automatically throw in UI,
 * so this intermediary representation is needed.
 */
export interface BackgroundRequestResponse<R> {
  isError: boolean;
  error?: any;
  data?: R;
}

/** A standard format for reporting errors back to ui. */
export interface BackgroundRequestError {
  message: string;
}

/** Used to generate BackgroundRequestResponses more consistently. */
export class BackgroundRequestResponseFactory {
  /** Generate a response for an error state. */
  static fromError(error: BackgroundRequestError): BackgroundRequestResponse<undefined> {
    return {
      isError: true,
      error
    }
  }
  /** Generate a successful response with useful payload. */
  static fromData<R>(data: R): BackgroundRequestResponse<R> {
    return {
      isError: false,
      data
    }
  }
}

/**
 * Used to send requests (with optional response) from UI to API background.
 * This isn't meant to be used directly, instead through derived classes for each request type.
 * 
 * @example <caption>Creating a new request type</caption>
 * ```
 * class MyRequest extends BackgroundRequest<MyRequestData, MyRequestResponse>{}
 * ```
 * @example <caption>Performing a request</caption>
 * ```
 * const response:MyResponse = await new MyRequest().run(data: MyData)
 * ```
 */
export abstract class BackgroundRequest<D extends BackgroundRequestData, R> {
  chromeApi: typeof chrome;

  /**
   * @param chromeApi The module used auth, messages, etc. Exposed globally in chrome, else mocked.
   */
  constructor(chromeApi: typeof chrome = window.chrome) {
    this.chromeApi = chromeApi;
  }

  /**
   * Send some data to the background as a request and await optional response.
   * @param data A BackgroundRequestData with type and parameters.
   * @return Promise<R> The response from API, if there is one.
   */
  run(data: D): Promise<R> {
    return new Promise((resolve, reject) => {
      this.chromeApi.runtime.sendMessage(data, (response: BackgroundRequestResponse<R>) => {
        if (response.isError) {
          return reject(response.error);
        }
        return resolve(response.data);
      });
    });
  }
}


/**
 *  This class lets UI request a list of user's projects
 */

export class FetchProjectsRequestData extends BackgroundRequestData {

  constructor() {
    super(BackgroundRequestType.FETCH_PROJECTS);
  }
}

interface FetchProjectsRequestResponse {
  projects: Array<any>;
}

export class FetchProjectsRequest extends BackgroundRequest<FetchProjectsRequestData,FetchProjectsRequestResponse> {

}

/**
 *  This class lets UI request a list of a debuggee breakpoints
 */

export class ListBreakpointsData extends BackgroundRequestData {
  debuggeeId: string;
  waitToken?: string;

  constructor(debuggeeId: string, waitToken: string) {
    super(BackgroundRequestType.LIST_BREAKPOINTS);
    this.debuggeeId = debuggeeId;
    this.waitToken = waitToken;
  }
}

interface ListBreakpointsResponse {
  breakpoints: Array<any>;
  nextWaitToken: string;
}

export class ListBreakPointsRequest extends BackgroundRequest<ListBreakpointsData,ListBreakpointsResponse> {

}

/**
 *  This class lets UI request a list of project's debuggees
 */

export class FetchDebuggeesRequestData extends BackgroundRequestData {
  projectId: string;

  constructor(projectId: string) {
    super(BackgroundRequestType.FETCH_DEBUGGEES);
    this.projectId = projectId; 
  }
}

interface FetchDebuggeesRequestResponse {
  debuggees: Array<any>;
}

export class FetchDebuggeesRequest extends BackgroundRequest<FetchDebuggeesRequestData,FetchDebuggeesRequestResponse> {

}

/**
 *  This class lets UI set a new breakpoint
 */

 export class SetBreakpointRequestData extends BackgroundRequestData {
  debuggeeId: string;
  fileName: string;
  lineNumber: number;

  constructor(debuggeeId: string, fileName: string, lineNumber: number) {
    super(BackgroundRequestType.SET_BREAKPOINT);
    this.debuggeeId = debuggeeId;
    this.fileName = fileName;
    this.lineNumber = lineNumber; 
  }
}

interface SetBreakpointRequestResponse {
  breakpoint: any;
}

export class SetBreakpointRequest extends BackgroundRequest<SetBreakpointRequestData,SetBreakpointRequestResponse> {

}

/**
 *  This class lets UI request full data for a specific breakpoint
 */

export class FetchBreakpointRequestData extends BackgroundRequestData {
  debuggeeId: string;
  breakpointId: string;

  constructor(debuggeeId: string, breakpointId: string) {
    super(BackgroundRequestType.FETCH_BREAKPOINT);
    this.debuggeeId = debuggeeId;
    this.breakpointId = breakpointId;
  }
}
interface FetchBreakpointRequestResponse {
  breakpoint: any;
}

export class FetchBreakpointRequest extends BackgroundRequest<FetchBreakpointRequestData,FetchBreakpointRequestResponse> {

}

/**
 *  Lets UI trigger authentication
 */
export class AuthenticationRequestData extends BackgroundRequestData {
  constructor() {
    super(BackgroundRequestType.AUTHENTICATION);
  }
}
interface AuthenticationRequestResponse {}

export class AuthenticationRequest extends BackgroundRequest<AuthenticationRequestData, AuthenticationRequestResponse> {}

/**
 *  Lets UI get current auth state from backend.
 */
export class GetAuthStateRequestData extends BackgroundRequestData {
  constructor() {
    super(BackgroundRequestType.IS_AUTHENTICATED);
  }
}
interface GetAuthStateRequestResponse {
  isAuthenticated: boolean
}

export class GetAuthStateRequest extends BackgroundRequest<GetAuthStateRequestData, GetAuthStateRequestResponse> {}

