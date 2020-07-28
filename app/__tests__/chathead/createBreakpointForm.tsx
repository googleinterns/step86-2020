import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { CreateBreakpointForm, ExpressionView, ExpressionsList, ConditionAndExpressionsForm } from "../../src/client/chathead/CreateBreakpointForm";
import { Button, IconButton, TextField } from "@material-ui/core";

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

  it ("handles conditions and expressions input", () => {
    const wrapper = mount(<CreateBreakpointForm activeBreakpoints={[]} completedBreakpoints={[]}/>);
    const condExpForm = wrapper.find(ConditionAndExpressionsForm).instance() as ConditionAndExpressionsForm;
    
    const condition = "a";
    const expressions = ["b", "c"];

    condExpForm.setCondition(condition);
    condExpForm.setExpressions(expressions);

    expect(wrapper.state()).toEqual({
      condition,
      expressions
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

    expect(spy).toHaveBeenCalledWith(fileName, lineNumber, condition, expressions);
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
});

describe("ExpressionView", () => {
  it("displays current expression", () => {
    const wrapper = mount(<ExpressionView expression="foo"/>);
    expect(wrapper.html()).toContain("foo");
  });

  it("calls delete callback", () => {
    const deleteSpy = jest.fn();
    const wrapper = mount(<ExpressionView onDelete={deleteSpy}/>);
    const deleteButton = wrapper.find(IconButton);
    deleteButton.simulate("click");
    expect(deleteSpy).toHaveBeenCalled();
  });

  it("calls change callback", () => {
    const changeSpy = jest.fn();
    const wrapper = mount(<ExpressionView onChange={changeSpy}/>);
    (wrapper.instance() as ExpressionView).onChange("foo");
    expect(changeSpy).toHaveBeenCalledWith("foo");
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

describe("ExpressionsList", () => {
  it("displays current expression", () => {
    const wrapper = mount(<ExpressionsList expressions={["a", "b"]}/>);
    expect(wrapper.find(ExpressionView).length).toBe(2);
  });

  it("can delete expression", () => {
    const setExpressionsSpy = jest.fn();
    const wrapper = mount(<ExpressionsList expressions={["a", "b"]} setExpressions={setExpressionsSpy}/>);
    (wrapper.find(ExpressionView).at(0).instance() as ExpressionView).onDelete();
    expect(setExpressionsSpy).toHaveBeenCalledWith(["b"]);
  });

  it("can change expression", () => {
    const setExpressionsSpy = jest.fn();
    const wrapper = mount(<ExpressionsList expressions={["a", "b"]} setExpressions={setExpressionsSpy}/>);
    (wrapper.find(ExpressionView).at(0).instance() as ExpressionView).onChange("c");
    expect(setExpressionsSpy).toHaveBeenCalledWith(["c", "b"]);
  });
});

describe("ConditionsAndExpressionsForm", () => {
  it("has condition input", () => {
    const wrapper = mount(<ConditionAndExpressionsForm condition="foo" expressions={[]}/>);
    expect(wrapper.find(TextField).props().value).toBe("foo");
  });

  it("has expressions list", () => {
    const wrapper = mount(<ConditionAndExpressionsForm condition="foo" expressions={["a"]}/>);
    expect(wrapper.find(ExpressionsList).props().expressions).toEqual(["a"]);
  });


  it("can add expression", () => {
    const setExpressionsSpy = jest.fn();
    const wrapper = mount(<ConditionAndExpressionsForm condition="foo" expressions={["a"]} setExpressions={setExpressionsSpy}/>);
    wrapper.find(Button).simulate("click");
    expect(setExpressionsSpy).toHaveBeenCalledWith(["a", ""]);
  });
});