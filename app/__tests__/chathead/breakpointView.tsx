import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FailedBreakpoint, BreakpointMeta } from "../../src/common/types/debugger";
import { getBreakpointErrorMessage } from "../../src/client/chathead/BreakpointView";
import { LocationView } from "../../src/client/chathead/BreakpointView";


configure({ adapter: new Adapter() });


describe("getBreakpointErrorMessage", () => {
  it("performs string substitution", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      isError: true,
      status: {
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
    const message = getBreakpointErrorMessage(mockBreakpoint as FailedBreakpoint);
    expect(message).toBe("Hello foo and bar.");
  });
});

describe("LocationView", () => {
  const mockBreakpoint: Partial<BreakpointMeta> = {
    location: {
      path: "foo.java",
      line: 24
    }
  }
  const wrapper = shallow(<LocationView breakpoint={mockBreakpoint}/>);
  expect(wrapper.text()).toBe("foo.java:24");
});