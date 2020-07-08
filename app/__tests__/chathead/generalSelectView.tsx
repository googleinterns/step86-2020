import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import {
  SelectView,
  LoadingView,
  OptionSelect,
  Option,
} from "../../src/client/chathead/GeneralSelectView";

describe("SelectView", () => {
  it("displays loading state", () => {
    const wrapper = shallow(
      <SelectView
        optionsLoading={true}
        options={[]}
        optionToId={opt => opt}
        selectedOptionId={"b"}
        onChange={() => {}}
      />
    );
    expect(wrapper.find(LoadingView)).toHaveLength(1);
  });

  it("displays options", () => {
    const wrapper = mount(
      <SelectView
        optionsLoading={false}
        options={["a", "b", "c"]}
        optionToId={opt => opt}
        selectedOptionId={"b"}
        onChange={() => {}}
      />
    );
    // Make sure three options are displayed
    const options = wrapper.find(Option);
    expect(options).toHaveLength(3);
    expect(options.at(0).text()).toEqual("a");
  });

  it("displays selected option", () => {
    const wrapper = mount(
      <SelectView
        optionsLoading={false}
        options={["a", "b", "c"]}
        optionToId={opt => opt}
        selectedOptionId={"b"}
        onChange={() => {}}
      />
    );

    // Find selected option
    expect(
      wrapper.find(OptionSelect).first().getElement().props.selectedOptionId
    ).toEqual("b");
  });

  it("calls back on option change", () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SelectView
        optionsLoading={false}
        options={["a", "b", "c"]}
        optionToId={opt => opt}
        selectedOptionId={"b"}
        onChange={spy}
      />
    );

    // Find and click option
    wrapper.find(OptionSelect).simulate("change", { target: { value: "a" } });
    expect(spy).toHaveBeenCalledWith("a");
  });
});
