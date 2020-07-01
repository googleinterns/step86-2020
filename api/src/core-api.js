const axios = require('axios');


var userAuth = "ya29.a0AfH6SMDdQ9RJ4Fzs2Fmb5kAutLKIJrkPB9ridsD3666-t6xRwwOQBYDw3FtX4w_6l_h1mH2fT-5dFUuUPgpWNwoVSiunNYU1mH4GIDstgUeDryGyJDGYLsHcUEQl_ajCwz6U951bS75D57y7uLAeu7Tp46DQ9hyUESA"; // Temp token
var debuggeeId=null;
var breakpointid=null;


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



function setBreakpoint(debuggeeId, file, line){
  axios.post('https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/set', {
    location: {
      path: file,
      line: line
    }
  },
  {
    headers: {
      Authorization: `Bearer ${userAuth}`
    },
    params: {
      debuggeeId: debuggeeId,
    }
  })
  .then(function (response) {
    breakpointid = response['data']['breakpoint']['id'];
  })
}



async function  main()  {
    console.dir(setBreakpoint("gcp:814996444798:fd0ebdbc768c5ef6", "DataServlet.java", 97))
  }
  
main();

module.exports = setAuthToken;
module.exports = fetchProjects;
