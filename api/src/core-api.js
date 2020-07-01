const axios = require('axios');


var userAuth = "ya29.a0AfH6SMDabecJYQOPnoOaCoD6L8wGwt9lLtP7ZJMpH7-gZdTOcdc28HdsDpvRberPDik_n2qxFQira648ingk-7VRhi86S54so0VMDxqhQx04jSypfQDyeE9a-DBDqJ3axAOUBp0oq8GprL_lpJk2inPNByWdk5PW5cQ"; // Temp token

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

async function  main()  {
  console.dir(await fetchProjects())  
}

main();

module.exports = setAuthToken;
module.exports = fetchProjects;
