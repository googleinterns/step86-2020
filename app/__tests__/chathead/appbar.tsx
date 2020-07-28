import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Appbar } from "../../src/client/chathead/Appbar";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { WindowSizeContext, WindowSize } from "../../src/client/chathead/windowSizeContext";

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
  

  it("shows collapse button and sets correct size.", () => {
    const setSizeSpy = jest.fn();
    const wrapper = mount(
      <WindowSizeContext.Provider value={{size: WindowSize.REGULAR, setSize: setSizeSpy}}>
        <Appbar/>
      </WindowSizeContext.Provider>
    );

    const collapseButton = wrapper.find('#size-collapse');
    expect(collapseButton.exists()).toBe(true);

    collapseButton.at(0).simulate("click");
    expect(setSizeSpy).toHaveBeenCalledWith(WindowSize.COLLAPSED);
  });

  it("shows full screen button and sets correct size", () => {
    const setSizeSpy = jest.fn();
    const wrapper = mount(
      <WindowSizeContext.Provider value={{size: WindowSize.REGULAR, setSize: setSizeSpy}}>
        <Appbar/>
      </WindowSizeContext.Provider>
    );

    const fullscreenButton = wrapper.find('#size-fullscreen');
    expect(fullscreenButton.exists()).toBe(true);

    fullscreenButton.at(0).simulate("click");
    expect(setSizeSpy).toHaveBeenCalledWith(WindowSize.FULL_SCREEN);
  });

  it("shows regular size button and sets correct size", () => {
    const setSizeSpy = jest.fn();
    const wrapper = mount(
      <WindowSizeContext.Provider value={{size: WindowSize.FULL_SCREEN, setSize: setSizeSpy}}>
        <Appbar/>
      </WindowSizeContext.Provider>
    );

    const regularButton = wrapper.find('#size-regular');
    expect(regularButton.exists()).toBe(true);

    regularButton.at(0).simulate("click");
    expect(setSizeSpy).toHaveBeenCalledWith(WindowSize.REGULAR);
  });

  it("doesn't show full screen button in full screen mode.", () => {
    const setSizeSpy = jest.fn();
    const wrapper = mount(
      <WindowSizeContext.Provider value={{size: WindowSize.FULL_SCREEN, setSize: setSizeSpy}}>
        <Appbar/>
      </WindowSizeContext.Provider>
    );

    expect(wrapper.find('#size-fullscreen').exists()).toBe(false);
  });

  it("doesn't show regular size button in regular mode.", () => {
    const setSizeSpy = jest.fn();
    const wrapper = mount(
      <WindowSizeContext.Provider value={{size: WindowSize.REGULAR, setSize: setSizeSpy}}>
        <Appbar/>
      </WindowSizeContext.Provider>
    );

    expect(wrapper.find('#size-regular').exists()).toBe(false);
  });

  it("renders custom children", () => {
    const wrapper = mount(<Appbar><div>foo</div></Appbar>);
    expect(wrapper.text()).toContain("foo");
  })
});
