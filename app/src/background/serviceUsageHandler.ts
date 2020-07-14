import api from "debugger-extension-api";

let enableURL = '';

export async function checkRequiredServices(projectNumber) {
    let responseData = false
    const response =  await api.fetchServices(projectNumber);
    const data = response.services
    for (let service of data) {
        if (service['name'].match(/projects\/\d*\/services\/clouddebugger.googleapis.com/g)){
            if (service['state'] === 'ENABLED'){
                responseData = true
            } else {
                enableURL = service['name'];
            }
        }
    }
    return responseData;
}

export async function enableRequiredService() {
    await api.enableServices(enableURL);
}