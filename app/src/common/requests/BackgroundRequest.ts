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
 */
export abstract class BackgroundRequest<D extends BackgroundRequestData, R> {
  run(data: D): Promise<R> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(data, (response: R) => {
        resolve(response);
      });
    });
  }
}
