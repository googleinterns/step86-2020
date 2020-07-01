const axios = require("axios");

var userAuth =
  "ya29.a0AfH6SMA17p8GUeKk9Q3EFquORHIghp0oozcSBeJasPR66lg9GuNeS1V6SQw61ye9la7LJGO1AIdKMdfTdlSaGgo4zHnn8iAn_xF0wCvHxOlnwLvIN65bsRH57Wle-_OD9xekH824Dgjo5G7w5zuP_mkN4qUaHMqDHF0"; // Temp token

exports.setAuthToken = (token) => {
  userAuth = token;
};

exports.getAuthToken = () => {
  return userAuth;
};

exports.fetchProjects = async () => {
  const response = await axios.get(
    "https://cloudresourcemanager.googleapis.com/v1/projects",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
    }
  );
  let data = response.data;
  return data;
};

exports.fetchDebuggees = async (projectId) => {
  const response = await axios.get(
    "https://clouddebugger.googleapis.com/v2/debugger/debuggees",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
      params: {
        project: projectId,
      },
    }
  );
  let data = response.data;
  return data;
};

exports.setBreakpoint = async (debuggeeId, file, line) => {
  axios
    .post(
      "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/set",
      {
        location: {
          path: file,
          line: line,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userAuth}`,
        },
        params: {
          debuggeeId: debuggeeId,
        },
      }
    )
    .then(function (response) {
      let data = response["data"];
      return data;
    });
};

exports.listBreakpoints = async (debuggeeId) => {
  const response = await axios.get(
    "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
      params: {
        debuggeeId: debuggeeId,
      },
    }
  );
  let data = response.data;
  // console.dir(data, {depth: 10})
  return data;
};

exports.getBreakpoint = async (debuggeeId, breakpointId) => {
  const response = await axios.get(
    "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/{breakpointId}",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
      params: {
        debuggeeId: debuggeeId,
        breakpointId: breakpointId,
      },
    }
  );
  let data = response.data;
  return data;
};
