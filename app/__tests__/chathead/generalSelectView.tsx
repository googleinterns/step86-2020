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
import { MenuItem, Select, CircularProgress } from "@material-ui/core";

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
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
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
    wrapper.find("input").simulate("change", { target: { value: "a" } });
    expect(spy).toHaveBeenCalledWith("a");
  });
});
