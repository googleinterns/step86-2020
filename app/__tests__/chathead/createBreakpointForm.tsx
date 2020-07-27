import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { CreateBreakpointForm } from "../../src/client/chathead/CreateBreakpointForm";
import { Button } from "@material-ui/core";

configure({ adapter: new Adapter() });

describe("CreateBreakpointForm", () => {
  it("renders", () => {
    const wrapper = shallow(
      <CreateBreakpointForm createBreakpoint={() => {}} />
    );
  });

  it("handles input", () => {
    const fileName = "a";
    const lineNumber = 1;


    const wrapper = shallow(
      <CreateBreakpointForm activeBreakpoints={[]} createBreakpoint={() => {}} />
    );
    const fileNameInput = wrapper.find('[data-testid="fileName"]');
    const lineNumberInput = wrapper.find('[data-testid="lineNumber"]');
    fileNameInput.simulate("change", { target: { value: fileName } });
    lineNumberInput.simulate("change", { target: { value: lineNumber } });

    expect(wrapper.state()).toMatchObject({
      fileName,
      lineNumber,
    });
  });

  it("calls createBreakpoint", () => {
    const spy = jest.fn();
    const preventFormSubmitSpy = jest.fn();

    const fileName = "a";
    const lineNumber = 1;
    const condition = "";
    const expressions = [];
 

    const wrapper = shallow(<CreateBreakpointForm activeBreakpoints={[]} createBreakpoint={spy} completedBreakpoints={[]} />);
    (wrapper.instance() as CreateBreakpointForm).onFileName(fileName);
    (wrapper.instance() as CreateBreakpointForm).onLineNumber(lineNumber);
    wrapper.find("#createBpButton").simulate("click", {preventDefault: preventFormSubmitSpy});

    expect(spy).toHaveBeenCalledWith(fileName, lineNumber);
    expect(preventFormSubmitSpy).toHaveBeenCalled();
  });

  it("calls DeleteAllActiveBreakpoint", () => {
    const spy = jest.fn();
    const preventFormSubmitSpy = jest.fn();
    const wrapper = shallow(<CreateBreakpointForm activeBreakpoints={[]} deleteAllActiveBreakpoints={spy} />);
    wrapper.find("#deleteActiveBpButton").simulate("click", {preventDefault: preventFormSubmitSpy});

    expect(spy).toHaveBeenCalled();
    expect(preventFormSubmitSpy).toHaveBeenCalled();
  });

  it("Prevents from creating breakpoint if breakpoint already existed in active BP list", () => {
    const spy = jest.fn();
    const preventFormSubmitSpy = jest.fn();
    const temp = {
      id: "string",
      location: {
        path: "a",
        line: 1,
      },
      createTime: "string",
      userEmail: "string",
    };
    const wrapper = shallow(
      <CreateBreakpointForm createBreakpoint={spy} activeBreakpoints={[temp]} />
    );
    (wrapper.instance() as CreateBreakpointForm).onFileName("a");
    (wrapper.instance() as CreateBreakpointForm).onLineNumber(1);
    wrapper.find("#createBpButton").simulate("click", {preventDefault: preventFormSubmitSpy});


    expect(spy).not.toHaveBeenCalled();
    expect(preventFormSubmitSpy).toHaveBeenCalled();
  });

  it("Prevents from creating breakpoint if breakpoint already existed in Completed BP list", () => {
    const spy = jest.fn();
    const preventFormSubmitSpy = jest.fn();
    const temp = {
      id: "string",
      location: {
        path: "a",
        line: 1,
      },
      createTime: "string",
      userEmail: "string",
      isFinalState: true,
      stackFrames: [],
      variableTable: [],
      finalTime: "string",
      labels: "any"
    };
    const wrapper = shallow(
      <CreateBreakpointForm createBreakpoint={spy} activeBreakpoints={[]} completedBreakpoints={[temp]} />
    );
    (wrapper.instance() as CreateBreakpointForm).onFileName("a");
    (wrapper.instance() as CreateBreakpointForm).onLineNumber(1);
    wrapper.find("#createBpButton").simulate("click", {preventDefault: preventFormSubmitSpy});


    expect(spy).not.toHaveBeenCalled();
    expect(preventFormSubmitSpy).toHaveBeenCalled();
  });




});
