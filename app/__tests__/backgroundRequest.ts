import chromeApi from "sinon-chrome";

import {
  BackgroundRequestType,
  BackgroundRequestData,
  BackgroundRequest,
  SetBreakpointRequestData,
  FetchBreakpointRequestData,
  FetchDebuggeesRequestData,
  ListBreakPointsRequest,
  ListBreakpointsData,
  AuthenticationRequestData,
  GetAuthStateRequestData,
  DeleteBreakpointRequestData,
  EnableRequiredServiceRequestData,
  RequiredServicesEnabledRequestData,
  BackgroundRequestResponse,
  BackgroundRequestResponseFactory,
  BackgroundRequestError
} from "../src/common/requests/BackgroundRequest";

// Mock
// Something like this would be used to send data from UI to API background
class SampleRequestData extends BackgroundRequestData {
  sampleProp: string;

  constructor(sampleProp: string) {
    super(BackgroundRequestType.FETCH_PROJECTS);
    this.sampleProp = sampleProp;
  }
}

//Mock response from API to UI
interface SampleResponse {
  foo: string;
}

// Mock of request to background from UI. No implementation, just sets type generics.
class SampleRequest extends BackgroundRequest<
  SampleRequestData,
  SampleResponse
> {}

describe("BackgroundRequestData", () => {
  it("can be instantiated", () => {
    const data = new SampleRequestData("test");
    expect(data.type).toBe(BackgroundRequestType.FETCH_PROJECTS);
    expect(data.sampleProp).toBe("test");
  });
});

// tests that setBreakPoint class is well instantiated with the right attributes
describe("SetBreakpointRequestData", () => {
  it("can be instantiated", () => {
    const data = new SetBreakpointRequestData("test", "test2", 2);
    expect(data.type).toBe(BackgroundRequestType.SET_BREAKPOINT);
    expect(data.debuggeeId).toBe("test");
    expect(data.fileName).toBe("test2");
    expect(data.lineNumber).toBe(2);
  });
});

// tests that FetchBreakPoint class is well instantiated with the right attributes
describe("FetchBreakpointRequestData", () => {
  it("can be instantiated", () => {
    const data = new FetchBreakpointRequestData("test1", "test2");
    expect(data.type).toBe(BackgroundRequestType.FETCH_BREAKPOINT);
    expect(data.debuggeeId).toBe("test1");
    expect(data.breakpointId).toBe("test2");
  });
});

// tests that FetchDebuggees class is well instantiated with the right attributes
describe("FetchDebuggeesRequestData", () => {
  it("can be instantiated", () => {
    const data = new FetchDebuggeesRequestData("test");
    expect(data.type).toBe(BackgroundRequestType.FETCH_DEBUGGEES);
    expect(data.projectId).toBe("test");
  });
});

// tests that ListBreakpoint class is well instantiated with the right attributes
describe("ListBreakpointRequestData", () => {
  it("can be instantiated", () => {
    const data = new ListBreakpointsData("test1","test2");
    expect(data.type).toBe(BackgroundRequestType.LIST_BREAKPOINTS);
    expect(data.debuggeeId).toBe("test1");
    expect(data.waitToken).toBe("test2");
  });
});

describe("AuthenticationRequestData", () => {
  it("can be instantiated", () => {
    const data = new AuthenticationRequestData();
    expect(data.type).toBe(BackgroundRequestType.AUTHENTICATION);
  });
});

describe("GetAuthStateRequestData", () => {
  it("can be instantiated", () => {
    const data = new GetAuthStateRequestData();
    expect(data.type).toBe(BackgroundRequestType.IS_AUTHENTICATED);
  });
});

describe("DeleteBreakpointRequestData", () => {
  it("can be instantiated", () => {
    const data = new DeleteBreakpointRequestData("test1", "test2");
    expect(data.debuggeeId).toBe("test1");
    expect(data.breakpointId).toBe("test2");
    expect(data.type).toBe(BackgroundRequestType.DELETE_BREAKPOINT);
  });
});

describe("EnableRequiredServiceRequestData", () => {
  it("can be instantiated", () => {
    const data = new EnableRequiredServiceRequestData(2);
    expect(data.type).toBe(BackgroundRequestType.ENABLE_REQUIRED_SERVICE);
    expect(data.projectNumber).toBe(2);
  });
});

describe("RequiredServicesEnabledRequestData", () => {
  it("can be instantiated", () => {
    const data = new RequiredServicesEnabledRequestData(2);
    expect(data.type).toBe(BackgroundRequestType.IS_SERVICE_ENABLED);
    expect(data.projectNumber).toBe(2);
  });
});


describe("BackgroundRequestResponseFactory", () => {
  it("can generate response", () => {
    const data = {foo: "bar"};
    expect(BackgroundRequestResponseFactory.fromData(data)).toEqual({isError: false, data});
  });

  it("can generate error", () => {
    const error = {message: "foo"} as BackgroundRequestError;
    expect(BackgroundRequestResponseFactory.fromError(error)).toEqual({isError: true, error});
  });
});

describe("BackgroundRequest", () => {
  beforeEach(() => {
    // Resets the stub for each test
    chromeApi.runtime.sendMessage.flush();
  });

  it("can be instantiated with default chrome", () => {
    const req = new SampleRequest();
  });

  it("can be instantiated with chrome mock", () => {
    const req = new SampleRequest((chromeApi as unknown) as typeof chrome);
  });

  it("can send a message", () => {
    const data = new SampleRequestData("test");
    const req = new SampleRequest((chromeApi as unknown) as typeof chrome);

    req.run(data);
    expect(chromeApi.runtime.sendMessage.calledOnceWith(data)).toBe(true);
  });

  it("can get a response", async () => {
    const data = new SampleRequestData("test");
    const req = new SampleRequest((chromeApi as unknown) as typeof chrome);

    const stub = BackgroundRequestResponseFactory.fromData({foo: "bar"});

    // Intercept the message and send a stubbed response.
    // "1" represents the index of the sendMessage response function.
    chromeApi.runtime.sendMessage.callsArgWith(1, stub);

    // Need to explicitly declare number of assertions to expect if async.
    expect.assertions(1);
    const response = await req.run(data);
    expect(response).toEqual(stub.data);
  });

  it("throws an error", async () => {
    const data = new SampleRequestData("test");
    const req = new SampleRequest((chromeApi as unknown) as typeof chrome);

    const stub = BackgroundRequestResponseFactory.fromError({message: "foo"});

    // Intercept the message and send a stubbed response.
    // "1" represents the index of the sendMessage response function.
    chromeApi.runtime.sendMessage.callsArgWith(1, stub);

    // Need to explicitly declare number of assertions to expect if async.
    expect.assertions(1);
    try {
      await req.run(data);
    } catch (expectedError) {
      expect(expectedError).toEqual(stub.error);
    }
  });
});
