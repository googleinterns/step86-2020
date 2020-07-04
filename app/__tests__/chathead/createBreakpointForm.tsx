import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { CreateBreakpointForm } from "../../src/client/chathead/CreateBreakpointForm";

configure({ adapter: new Adapter() });

describe("CreateBreakpointForm", () => {
    it("renders", () => {
        const wrapper = shallow(<CreateBreakpointForm createBreakpoint={() => {}}/>);
    });

    it("handles input", () => {
        const wrapper = shallow(<CreateBreakpointForm createBreakpoint={() => {}}/>);
        const fileNameInput = wrapper.find('[data-testid="fileName"]');
        const lineNumberInput = wrapper.find('[data-testid="lineNumber"]');
        fileNameInput.simulate("change", {target: {value: "a"}})
        lineNumberInput.simulate("change", {target: {value: 1}});

        expect(wrapper.state()).toEqual({
            fileName: "a",
            lineNumber: 1
        });
    });

    it("calls createBreakpoint", () => {
        const spy = jest.fn();
        const wrapper = shallow(<CreateBreakpointForm createBreakpoint={spy}/>);
        (wrapper.instance() as CreateBreakpointForm).onFileName("a");
        (wrapper.instance() as CreateBreakpointForm).onLineNumber(1);
        wrapper.find("button").simulate("click");

        expect(spy).toHaveBeenCalledWith("a", 1);
    });
});