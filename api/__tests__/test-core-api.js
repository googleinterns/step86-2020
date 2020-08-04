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

  it("Can set breakpoint with condition", async () => {
    const mockDebuggeeId = "foo";
    const mockFile = "bar";
    const mockLineNumber = 88;
    const mockCondition = "testCondition";

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
      mockLineNumber,
      mockCondition
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });

  it("Can set breakpoint with expression", async () => {
    const mockDebuggeeId = "foo";
    const mockFile = "bar";
    const mockLineNumber = 88;
    const mockExpression = [
      "testExpression1",
      "testExpression2",
      "testExpression3",
    ];

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
      mockLineNumber,
      mockExpression
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });

  it("Can set breakpoint with condition and expression", async () => {
    const mockDebuggeeId = "foo";
    const mockFile = "bar";
    const mockLineNumber = 88;
    const mockCondition = "testCondition";
    const mockExpression = [
      "testExpression1",
      "testExpression2",
      "testExpression3",
    ];

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
      mockLineNumber,
      mockCondition,
      mockExpression
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

  it("Can delete breakpoint", async () => {
    const mockDebuggeeId = "foo";
    const mockBreakpointId = "bar";

    const mockResponse = {
      status: 200,
      response: [{}],
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
    const breakpoint = await api.deleteBreakpoint(
      mockDebuggeeId,
      mockBreakpointId
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });


  it("Can fetch User Information", async () => {
    expect.assertions(1);
    const mockUserData = [{ name: "Foo", email: "fooBar@example.com", picture: "fooBar.png" }];
    const mockAuthToken = "authToken";
    moxios.stubRequest(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=".concat(mockAuthToken),
      {
        status: 200,
        responseText: mockUserData,
      }

    );
    api.setAuthToken(mockAuthToken)
    const userInfo = await api.getUserInfo(mockAuthToken);
    expect(userInfo).toEqual(mockUserData);
  });


  it("Can fetch enabled services in the project", async () => {
    const mockProjectNumber= "1234567";

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
        "https://serviceusage.googleapis.com/v1/{parent=*/*}/services"
      );
      request.respondWith(mockResponse);
    });

    // Call the API
    const breakpoint = await api.fetchServices(
      mockProjectNumber
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });

  it("Can enable given services in the project", async () => {
    const mockProjectName= "projects/1234567/services/fooBar.googleapis.com";

    const mockResponse = {
      status: 200,
      response: [{ service: "ENABLED" }],
    };

    // This depends on the number of "expect" checks we have below
    expect.assertions(2);

    // Before calling the API, set up a function to intercept the API request.
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      expect(request.config.url).toEqual(
        "https://serviceusage.googleapis.com/v1/".concat(mockProjectName, ":enable")
      );
      request.respondWith(mockResponse);
    });

    // Call the API
    const breakpoint = await api.enableService(
      mockProjectName
    );
    expect(breakpoint).toEqual(mockResponse.response);
  });

});
