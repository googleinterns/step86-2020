import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FailedBreakpoint } from "../../src/common/types/debugger";
import { getBreakpointErrorMessage } from "../../src/client/chathead/BreakpointView";

configure({ adapter: new Adapter() });


describe("getBreakpointErrorMessage", () => {
  it("performs string substitution", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      status: {
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
    const message = getBreakpointErrorMessage(mockBreakpoint);
    expect(message).toBe("Hello foo and bar.");
  });
});