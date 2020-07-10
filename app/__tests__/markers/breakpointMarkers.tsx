import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { NewBreakpointMarker } from "../../src/client/markers/BreakpointMarker";

configure({ adapter: new Adapter() });

describe("NewBreakpointMarker", () => {
  it("responds to clicks", () => {
    const spy = jest.fn();
    const wrapper = shallow(<NewBreakpointMarker onClick={spy}/>);
    wrapper.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
});