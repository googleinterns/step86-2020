const axios = require('axios');


var userAuth = "ya29.a0AfH6SMCCEwdJKvs-NN2c34UB5PEVD-61tTmphALVUoEKKZKLgRifzgluUXwBN1TJbzKBROpsyuR8Qq6usq6-AmGGPMmbbq5BXhboXK6kOQZJ3OSFmJ_pdN0bdoR2Fo2u6nc3yMiMe_t9rEf55PV5QWalYja2oIko8lY"; // Temp token

function setAuthToken(token){
  userAuth = token; 
}

async function fetchProjects() {
    const response = await axios.get("https://cloudresourcemanager.googleapis.com/v1/projects",{
      headers: {
        Authorization: `Bearer ${userAuth}`
      }
    });
    let data = response.data;
    return data;
}


async function fetchDebuggees(projectId) {
  const response = await axios.get("https://clouddebugger.googleapis.com/v2/debugger/debuggees",{
    headers: {
      Authorization: `Bearer ${userAuth}`
    },
    params: {
      project: projectId,
    }
  });
  let data = response.data;
  return data;
}



async function  main()  {
    console.dir(await fetchDebuggees("kdalal-step-2020"))
  }
  
main();

module.exports = setAuthToken;
module.exports = fetchProjects;
