import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Appbar } from "../../src/client/chathead/Appbar";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

configure({ adapter: new Adapter() });

describe("Appbar", () => {
  it("displays title.", () => {
    const wrapper = shallow(<Appbar title="Foo"/>);
    expect(wrapper.text()).toBe("Foo");
  });

  it("displays no back button if no handler provider.", () => {
    const wrapper = shallow(<Appbar title="Foo"/>);
    expect(wrapper.find(ArrowBackIcon).length).toBe(0);
  });

  it("displays back button if handler provided, and responds to click.", () => {
    const backButtonSpy = jest.fn();
    const wrapper = shallow(<Appbar title="Foo" onBack={backButtonSpy}/>);

    const backButton = wrapper.find(ArrowBackIcon);
    expect(backButton.length).toBe(1);

    backButton.parent().simulate("click");
    expect(backButtonSpy).toHaveBeenCalled();
  });
});
