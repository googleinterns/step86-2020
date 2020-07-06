import api from "debugger-extension-api";




BackgroundRequestHandler.on(BackgroundRequestType.FETCH_PROJECT, async data => {
    const response = await api.fetchProjects(); 
    return response;
})

BackgroundRequestHandler.on(BackgroundRequestType.FETCH_DEBUGGEES, async data => {
    const response = await api.fetchDebuggees(data.projectId); 
    return response;
})

