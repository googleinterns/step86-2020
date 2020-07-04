import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { SelectDebugeeContainer } from "../../src/client/chathead/SelectDebugee";
import { SelectView } from "../../src/client/chathead/GeneralSelectView";

describe("SelectDebugeeContainer", () => {
  it("loads debugees when mounted", () => {
    const loadDebugeesSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectDebugeeContainer
        debugeeId={undefined}
        loadDebugees={loadDebugeesSpy}
      />
    );
    expect(loadDebugeesSpy).toHaveBeenCalledTimes(1);
  });

  it("goes into loading state when loading debugees", () => {
    const loadProjectsSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectDebugeeContainer
        debugeeId={undefined}
        loadDebugees={loadProjectsSpy}
      />
    );
    expect(wrapper.state().debugeesLoading).toEqual(true);
  });

  it("moves debugees to state once loaded", async (done) => {
    const mockDebugees = ["a", "b", "c"];
    const wrapper = shallow(
      <SelectDebugeeContainer
        debugeeId={undefined}
        loadDebugees={async () => mockDebugees}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      expect(wrapper.state()).toEqual({
        debugees: mockDebugees,
        debugeesLoading: false,
      });
      done();
    });
  });

  it("bubbles up onChange from nested SelectView", async (done) => {
    const spy = jest.fn();
    const wrapper = shallow(
      <SelectDebugeeContainer
        debugeeId={undefined}
        loadDebugees={async () => ["a", "b", "c"]}
        onChange={spy}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      wrapper.find(SelectView).invoke("onChange")("a");
      expect(spy).toHaveBeenCalledWith("a");
      done();
    });
  });
});
