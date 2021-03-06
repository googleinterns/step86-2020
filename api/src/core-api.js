const axios = require("axios");

var userAuth = ""; // Create temp token using https://developers.google.com/oauthplayground/

/**
 * Sets the auth token used to validate the user's GCP access,
 * and access their projects(data).
 * @param {String} token User's auth token used to access GCP and their data.
 */
exports.setAuthToken = (token) => {
  userAuth = token;
};

/**
 * Returns the auth token.
 */
exports.getAuthToken = () => {
  return userAuth;
};

/**
 * Fetches the user's projects by making a request to Cloud Debugger
 * service's api using auth token
 */
exports.fetchProjects = async () => {
  const response = await axios.get(
    "https://cloudresourcemanager.googleapis.com/v1/projects",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
    }
  );
  const data = response.data;
  return data;
};

/**
 * Fetches the user's active debuggee's by making a request to Cloud Debugger
 * service's api using auth token and projectId.
 * @param {String} projectId User's projectId used to see active debbugee's on project.
 */
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
  const data = response.data;
  return data;
};

/**
 * Sets the breakpoint using the location and debuggeeId by
 * calling the the Cloud Debugger service's api using auth
 * token and projectId.
 * @param {String} debuggeeId User's active debuggeeID used to debug an application.
 * @param {String} file Name of the file to set the breakpoint on.
 * @param {String} line line number of that file to set the breakpoint.
 */
exports.setBreakpoint = async (
  debuggeeId,
  file,
  line,
  condition = "",
  expressions = []
) => {
  const response = await axios.post(
    "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/set",
    {
      location: {
        path: file,
        line: line,
      },
      condition: condition,
      expressions: expressions,
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
  const data = response.data;
  return data;
};

/**
 * Lists all the breakpoints using debuggeeId by calling the
 * the Cloud Debugger service's api.
 * @param {String} debuggeeId User's active debuggeeID used to debug an application.
 */
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
  const data = response.data;
  return data;
};

/**
 * Gets the stack trace of a breakpoint using debuggeeId and breakpointId by calling the
 * the Cloud Debugger service's api.
 * @param {String} debuggeeId User's active debuggeeID used to debug an application.
 * @param {String} breakpointId breakpoint id to get the stack trace of that breakpoint.
 */
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
  const data = response.data;
  return data;
};

/**
 * Deletes the breakpoint using debuggeeId and breakpointId by calling the
 * the Cloud Debugger service's api.
 * @param {String} debuggeeId User's active debuggeeID used to debug an application.
 * @param {String} breakpointId breakpoint id to get the stack trace of that breakpoint.
 */
exports.deleteBreakpoint = async (debuggeeId, breakpointId) => {
  const response = await axios.delete(
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
  const data = response.data;
  return data;
};

/**
 * Fetches all the enabled services using Service Usage API .
 * @param {String} projectNumber User's current project number.
 */
exports.fetchServices = async (projectNumber) => {
  const response = await axios.get(
    "https://serviceusage.googleapis.com/v1/{parent=*/*}/services",
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
      params: {
        parent: "projects/".concat(projectNumber),
        pageSize: 200,
        filter: "state:ENABLED",
      },
    }
  );
  const data = response.data;
  return data;
};

/**
 * Enables the service by making a POST call to Service Usage API .
 * @param {String} name User's current project number.
 */
exports.enableService = async (name) => {
  const url = "https://serviceusage.googleapis.com/v1/".concat(name, ":enable");
  const response = await axios.post(url,{},
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      }});
  return response.data;
};

/**
 * Gets the user informatin by making call to userinfo api.
 */
exports.getUserInfo = async () => {
  if (userAuth !== ""){
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=".concat(userAuth);
    const response = await axios.get(url);
    return response.data;
  }
}
