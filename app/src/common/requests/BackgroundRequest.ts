/**
 * Background
 */

/**
 *  Each request must include a type field.
 *  This is used to coordinate requests between UI and API,
 *  and dispatch them to the correct handlers.
 */
export enum BackgroundRequestType {
  FETCH_PROJECTS,
  FETCH_DEBUGGEES,
  FETCH_BREAKPOINTS,
  SET_BREAKPOINT,
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
  constructor(chromeApi: typeof chrome = chrome) {
    this.chromeApi = chromeApi;
  }

  /**
   * Send some data to the background as a request and await optional response.
   * @param data A BackgroundRequestData with type and parameters.
   * @return Promise<R> The response from API, if there is one.
   */
  run(data: D): Promise<R> {
    return new Promise((resolve) => {
      this.chromeApi.runtime.sendMessage(data, (response: R) => {
        resolve(response);
      });
    });
  }
}
