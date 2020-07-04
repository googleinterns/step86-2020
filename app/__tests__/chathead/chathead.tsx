import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { Chathead } from "../../src/client/chathead/Chathead";
import { SelectProjectContainer } from "../../src/client/chathead/SelectProject";
import { SelectDebugeeContainer } from "../../src/client/chathead/SelectDebugee";

describe("Chathead", () => {
  it("displays SelectProjectContainer when no project selected.", () => {
    const wrapper = shallow(
      <Chathead
        projectId={undefined}
        debuggeeId={undefined}
        breakpoints={[]}
        createBreakpoint={() => {}}
      />
    );
    expect(wrapper.find(SelectProjectContainer)).toHaveLength(1);
  });

  it("handles project selection", () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <Chathead
        projectId={undefined}
        debuggeeId={undefined}
        breakpoints={[]}
        createBreakpoint={() => {}}
        setProject={spy}
      />
    );
    wrapper.find(SelectProjectContainer).invoke("onChange")("a");
    expect(spy).toHaveBeenCalledWith("a");
  });

  it("displays SelectDebugeeContainer when no debugee selected.", () => {
    const wrapper = shallow(
      <Chathead
        projectId={"a"}
        debuggeeId={undefined}
        breakpoints={[]}
        createBreakpoint={() => {}}
      />
    );
    expect(wrapper.find(SelectDebugeeContainer)).toHaveLength(1);
  });
});
