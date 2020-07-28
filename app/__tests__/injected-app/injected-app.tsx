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
      breakpoint: { id: "a" },
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
    expect(runSpy).not.toHaveBeenCalled();
  });
});
