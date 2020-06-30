
var userAuth = null;

function setAuthToken(token){
  userAuth = token; 
}

async function fetchProjects() {
  // if (userAuth !== NULL) {
    const response = await fetch("https://cloudresourcemanager.googleapis.com/v1/projects", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${userAuth}`
        }
    });
    const json = await response.json();
  // }
  return json;
}

console.log(fetchProjects); 


module.exports = setAuthToken;
module.exports = fetchProjects;
