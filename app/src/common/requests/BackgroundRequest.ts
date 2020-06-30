
/**
 *  Each request must include a type field.
 *  This is used to coordinate requests between UI and API,
 *  and dispatch them to the correct handlers.
 */
export enum BackgroundRequestType {
    FETCH_PROJECTS,
    FETCH_DEBUGGEES,
    FETCH_BREAKPOINTS,
    SET_BREAKPOINT
}

/**
 * A standardized format for all background requests.
 * Each type of request must extend this with its required parameters.
 */
export abstract class BackgroundRequestData{
    /** Used for dispatching to correct handler. */
    type: BackgroundRequestType;

    constructor(type: BackgroundRequestType) {
        this.type = type;
    }
}
