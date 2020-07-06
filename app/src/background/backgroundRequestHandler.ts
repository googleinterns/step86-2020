import api from "debugger-extension-api";
import { BackgroundRequestType, BackgroundRequestData } from "../common/requests/BackgroundRequest";

class BackgroundRequestHandler {
    static handlers = {};

    static on<D extends BackgroundRequestData>(type: BackgroundRequestType, callback: (data: D) => Promise<any>){
        BackgroundRequestHandler.handlers[type] = callback;
    }

}

BackgroundRequestHandler.on(BackgroundRequestType.FETCH_PROJECT, async data => {
    const response = await api.fetchProjects(); 
    return response;
})

BackgroundRequestHandler.on(BackgroundRequestType.FETCH_DEBUGGEES, async data => {
    const response = await api.fetchDebuggees(data.projectId); 
    return response;
})

BackgroundRequestHandler.on(BackgroundRequestType.SET_BREAKPOINT, async data => {
    const response = await api.setBreakpoint(data.debuggeeId, data.fileName, data.lineNumber); 
    return response;
})

BackgroundRequestHandler.on(BackgroundRequestType.FETCH_BREAKPOINT, async data => {
    const response = await api.getBreakpoint(data.debuggeeId, data.breakpointId); 
    return response;
})

BackgroundRequestHandler.on(BackgroundRequestType.LIST_BREAKPOINTS, async data => {
    const response = await api.fetchDebuggees(data.debuggeeId); 
    return response;
})
