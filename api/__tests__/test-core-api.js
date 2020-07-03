const moxios = require("moxios");
const api = require("../src/core-api");

describe("Testing API functions", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it("Can fetch projects", async () => {
    expect.assertions(1);
    const mockProjectsData = [{ project: 1 }];
    moxios.stubRequest(
      "https://cloudresourcemanager.googleapis.com/v1/projects",
      {
        status: 200,
        responseText: mockProjectsData,
      }
    );
    const projects = await api.fetchProjects();
    expect(projects).toEqual(mockProjectsData);
  });

  it("Can fetch debuggees", async () => {
    const mockProjectId = "foo";
    const mockResponse = {
      status: 200,
      response: [{ debuggee: 1 }],
    };

    // This depends on the number of "expect" checks we have below
    expect.assertions(3);

    // Before calling the API, set up a function to intercept the API request.
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      // This should be checked for all
      expect(request.config.url).toEqual(
        "https://clouddebugger.googleapis.com/v2/debugger/debuggees"
      );
      // This should be checked for each param (if there are params)
      expect(request.config.params.project).toEqual(mockProjectId);

      request.respondWith(mockResponse);
    });

    // Call the API
    const debuggees = await api.fetchDebuggees(mockProjectId);
    expect(debuggees).toEqual(mockResponse.response);
  });

  it("Can set breakpoint", async () => {
    const mockDebuggeeId = "foo";
    const mockFile = "bar";
    const mockLineNumber = 88;

    const mockResponse = {
      status: 200,
      response: { data: { breakpointid: 1 } },
    };

    // This depends on the number of "expect" checks we have below
    expect.assertions(2);

    // Before calling the API, set up a function to intercept the API request.
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      expect(request.config.url).toEqual(
        "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/set"
      );
      request.respondWith(mockResponse);
    });

    // Call the API
    const breakpoint = await api.setBreakpoint(
      mockDebuggeeId,
      mockFile,
      mockLineNumber
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });

  it("Can list breakpoints", async () => {
    const mockDebuggeeId = "foo";
    const debuggeeId = "foo";
    const mockResponse = {
      status: 200,
      response: [{ breakpoint: 1 }],
    };

    // This depends on the number of "expect" checks we have below
    expect.assertions(3);

    // Before calling the API, set up a function to intercept the API request.
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      // This should be checked for all
      expect(request.config.url).toEqual(
        "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints"
      );
      expect(debuggeeId).toEqual(mockDebuggeeId);
      request.respondWith(mockResponse);
    });

    // Call the API
    const breakpoints = await api.listBreakpoints(mockDebuggeeId);
    expect(breakpoints).toEqual(mockResponse.response);
  });

  it("Can get breakpoint", async () => {
    const mockDebuggeeId = "foo";
    const mockBreakpointId = "bar";

    const mockResponse = {
      status: 200,
      response: [{ breakpoints: 1 }],
    };

    // This depends on the number of "expect" checks we have below
    expect.assertions(2);

    // Before calling the API, set up a function to intercept the API request.
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      expect(request.config.url).toEqual(
        "https://clouddebugger.googleapis.com/v2/debugger/debuggees/{debuggeeId}/breakpoints/{breakpointId}"
      );
      request.respondWith(mockResponse);
    });

    // Call the API
    const breakpoint = await api.getBreakpoint(
      mockDebuggeeId,
      mockBreakpointId
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });
});