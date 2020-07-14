import api from "debugger-extension-api";


export async function checkRequiredServices(projectNumber) {
    let responseData = false
    const response =  await api.fetchServices("814996444798");
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


console.log(checkRequiredServices("814996444798"))