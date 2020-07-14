import api from "debugger-extension-api";


export async function checkRequiredServices(projectNumber) {
    let responseData = false
    const response =  await api.fetchServices(projectNumber);
    const data = response.services
    for (let service of data) {
        if (service['name'].match(/projects\/\d*\/services\/clouddebugger.googleapis.com/g)){
            if (service['state'] === 'ENABLED'){
                responseData = true
            }
        }
    }
    return responseData;
}

export async function enableRequiredService(projectNumber) {
    const enableURL = "projects/".concat(projectNumber,"/services/clouddebugger.googleapis.com")
    await api.enableServices(enableURL);
}