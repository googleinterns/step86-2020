import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { InjectedApp } from "../../src/client/injected/injected-app/InjectedApp";

describe("Injected App", () => {
    it("displays SelectProjectContainer when no project selected.", () => {
      const wrapper = mount(
        <InjectedApp
          projectId={undefined}
          debuggeeId={undefined}
          activeBreakpoints={[]}
          completedBreakpoints={[]}
          createBreakpoint={() => {}}
        />
      );
      expect(wrapper.find(SelectProjectContainer)).toHaveLength(1);
    });
});
  