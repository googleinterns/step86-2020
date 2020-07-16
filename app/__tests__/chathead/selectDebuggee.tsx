import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { SelectDebuggeeContainer } from "../../src/client/chathead/SelectDebuggee";
import { SelectView } from "../../src/client/chathead/GeneralSelectView";
import { BackgroundRequestError } from "../../src/common/requests/BackgroundRequest";

describe("SelectDebuggeeContainer", () => {
  it("loads debuggees when mounted", () => {
    const loadDebuggeesSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectDebuggeeContainer
        debuggeeId={undefined}
        loadDebuggees={loadDebuggeesSpy}
      />
    );
    expect(loadDebuggeesSpy).toHaveBeenCalledTimes(1);
  });

  it("goes into loading state when loading debuggees", () => {
    const loadProjectsSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectDebuggeeContainer
        debuggeeId={undefined}
        loadDebuggees={loadProjectsSpy}
      />
    );
    expect(wrapper.state().debuggeesLoading).toEqual(true);
  });

  it("moves debuggees to state once loaded", async (done) => {
    const mockDebuggees = ["a", "b", "c"];
    const wrapper = shallow(
      <SelectDebuggeeContainer
        debuggeeId={undefined}
        loadDebuggees={async () => mockDebuggees}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      expect(wrapper.state()).toEqual({
        debuggees: mockDebuggees,
        debuggeesLoading: false,
      });
      done();
    });
  });

  it("bubbles up onChange from nested SelectView", async (done) => {
    const spy = jest.fn();
    const wrapper = shallow(
      <SelectDebuggeeContainer
        debuggeeId={undefined}
        loadDebuggees={async () => ["a", "b", "c"]}
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

  it("shows error if load fails", async (done) => {
    const error = {message: "foo"} as BackgroundRequestError;
    const wrapper = shallow(
      <SelectDebuggeeContainer
        debuggeeId={undefined}
        loadDebuggees={async () => {throw error}}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      // Error message is shown
      expect(wrapper.text()).toContain("foo");
      // Select is hidden
      expect(wrapper.find(SelectView).isEmpty()).toBe(true);
      done();
    });
  });
});
