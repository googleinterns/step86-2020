import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createMount } from '@material-ui/core/test-utils';

configure({ adapter: new Adapter() });

import {
  SelectView
} from "../../src/client/chathead/GeneralSelectView";
import { MenuItem, Select, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
});
