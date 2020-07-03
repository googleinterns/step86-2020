const axios = require("axios");

var userAuth =
  "ya29.a0AfH6SMDMnBCWmOJAduBYz7aQiSQrjCoADIKQLUe25nIqq0lK0pJzPK_nZ8uoo4ylkrZomC3NozvggV2AjJoWgNDLMpvT3Sdfn5sAtrTwztWuPcZ-IG5lweL0A8RT4cWY86vPmGN50Tpbv96D__Vbo90DCpcA3FmbLwc"; // Temp token

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
  const response = await axios.post(
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
  );
  let data = response.data;
  return data;
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
