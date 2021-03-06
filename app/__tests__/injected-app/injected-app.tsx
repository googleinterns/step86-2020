import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { InjectedApp } from "../../src/client/injected/injected-app";
import { Chathead } from "../../src/client/chathead/Chathead";
import {
  BackgroundRequestData,
  BackgroundRequestType,
  GetAuthStateRequestData,
  FetchBreakpointRequestData,
  SetBreakpointRequestData,
  DeleteBreakpointRequestData
} from "../../src/common/requests/BackgroundRequest";
import * as backgroundRequest from "../../src/common/requests/BackgroundRequest";

class SampleRequestData extends BackgroundRequestData {
  constructor() {
    super(BackgroundRequestType.FETCH_PROJECTS);
  }

  run() {}
}
describe("Injected App", () => {
  it("displays injected app when no project selected.", () => {
    const wrapper = mount(
      <InjectedApp
        projectId={undefined}
        debuggeeId={undefined}
        breakpoints={[]}
        lineNum={5}
        fileName={"index.js"}
        activeBreakpoints={[]}
        completedBreakpoints={[]}
      />
    );
    expect(wrapper.find(Chathead)).toHaveLength(0);
  });

  it("checks getGcpProjectId method is called.", () => {
    jest.spyOn(InjectedApp.prototype, "getGcpProjectId");
    shallow(<InjectedApp />);
    expect(InjectedApp.prototype.getGcpProjectId).toHaveBeenCalled();
  });

  it("checks getProjectNameFromGithub method is called.", () => {
    jest.spyOn(InjectedApp.prototype, "getProjectNameFromGithub");
    shallow(<InjectedApp />);
    expect(InjectedApp.prototype.getProjectNameFromGithub).toHaveBeenCalled();
  });
});

describe("Saving Project IDs", () => {
  const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  };

  let getProjectNameMock: jest.SpyInstance;

  beforeAll(() => {
    getProjectNameMock = jest.spyOn(
      InjectedApp.prototype,
      "getProjectNameFromGithub"
    );
  });

  afterEach(() => {
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();

    getProjectNameMock.mockClear();
  });

  afterAll(() => {
    getProjectNameMock.mockRestore();
  });

  it("sets if projectId defined and projectName defined", () => {
    getProjectNameMock.mockReturnValue("projectName");
    const wrapper = shallow(<InjectedApp localStorage={localStorageMock} />);
    (wrapper.instance() as InjectedApp).saveGcpProjectId("projectId");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "projectName",
      "projectId"
    );
  });

  it("does not set if projectId defined and projectName not defined", () => {
    getProjectNameMock.mockReturnValue(undefined);
    const wrapper = shallow(<InjectedApp localStorage={localStorageMock} />);
    (wrapper.instance() as InjectedApp).saveGcpProjectId("projectId");
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  it("does not set if projectId not defined and projectName not defined", () => {
    getProjectNameMock.mockReturnValue(undefined);
    const wrapper = shallow(<InjectedApp localStorage={localStorageMock} />);
    (wrapper.instance() as InjectedApp).saveGcpProjectId(undefined);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  it("clears item if projectId not defined and projectName defined", () => {
    getProjectNameMock.mockReturnValue("projectName");
    const wrapper = shallow(<InjectedApp localStorage={localStorageMock} />);
    wrapper.instance().saveGcpProjectId(undefined);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("projectName");
  });

  it("test get auth state", () => {
    const runSpy = jest.fn().mockResolvedValueOnce({
      state: {status :  " "},
    });

    const { BackgroundRequest, GetAuthStateRequestData } = backgroundRequest;
    const mockRequest = class extends BackgroundRequest<
      GetAuthStateRequestData,
      {}
    > {};
    mockRequest.prototype.run = runSpy;
    const wrapper = mount(
      <InjectedApp
        backgroundRequest={{
          ...backgroundRequest,
          GetAuthStateRequest: mockRequest,
        }}
      />
    );
    wrapper.instance().getAuthState();
  });



  it("tests for creating the breakpoint", () => {
    const runSpy = jest.fn().mockResolvedValueOnce({
      breakpoint: {
        fileName: "foo",
        lineNumber: 1,
        condition: "",
        expressions: [],
      },
    });

    const { BackgroundRequest, SetBreakpointRequestData } = backgroundRequest;
    const mockRequestClass = class extends BackgroundRequest<
      SetBreakpointRequestData,
      {}
    > {};
    mockRequestClass.prototype.run = runSpy;

    const wrapper = mount(
      <InjectedApp
        backgroundRequest={{
          ...backgroundRequest,
          SetBreakpointRequest: mockRequestClass,
        }}
      />
    );

    wrapper.instance().createBreakPoint({ fileName: "foo", lineNumber: 1 });
    expect(runSpy).not.toHaveBeenCalledWith(
      1,
      expect.objectContaining({ fileName: "foo" })
    );
  });

  it("tests the load breakpoint", () => {
    const runSpy = jest
      .fn()
      .mockResolvedValueOnce({
        breakpoint: { id: "a" },
      })
      .mockResolvedValueOnce({
        breakpoint: { id: "b" },
      })
      .mockResolvedValueOnce({
        breakpoint: { id: "c" },
      });

    const { BackgroundRequest, FetchBreakpointRequestData } = backgroundRequest;
    const mockRequestClass = class extends BackgroundRequest<
      FetchBreakpointRequestData,
      {}
    > {};
    mockRequestClass.prototype.run = runSpy;

    const wrapper = mount(
      <InjectedApp
        backgroundRequest={{
          ...backgroundRequest,
          FetchBreakpointRequest: mockRequestClass,
        }}
      />
    );

    wrapper.instance().loadBreakpoints(["a", "b"]);
    expect(runSpy).not.toHaveBeenCalledWith(
      1,
      expect.objectContaining({ breakpointId: "a" })
    );
  });

  it("tests delete all breakpoints", () => {
    const runSpy = jest
      .fn()
      .mockResolvedValueOnce({
        breakpoint: { id: "a" },
      })
      .mockResolvedValueOnce({
        breakpoint: { id: "b" },
      })
      .mockResolvedValueOnce({
        breakpoint: { id: "c" },
      });

    const { BackgroundRequest, DeleteBreakpointRequestData } = backgroundRequest;
    const mockRequestClass = class extends BackgroundRequest<
    DeleteBreakpointRequestData,
      {}
    > {};
    mockRequestClass.prototype.run = runSpy;

    const wrapper = mount(
      <InjectedApp
        backgroundRequest={{
          ...backgroundRequest,
          DeleteBreakpointRequest: mockRequestClass,
        }}
      />
    );

    wrapper.instance().deleteAllActiveBreakpoints(["a", "b"]);
    expect(runSpy).not.toHaveBeenCalledWith(
      1,
      expect.objectContaining({ breakpointId: "a" })
    );
  });


});
