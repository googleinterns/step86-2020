import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { Popup } from "../src/client/popup/Popup";

test("Sample popup renders correctly.", () => {
  const wrapper = shallow(<Popup />);
  expect(wrapper.contains(<h1>Welcome to Cloud Debugger !</h1>)).toBe(false);
});
