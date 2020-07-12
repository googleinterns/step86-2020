import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { InjectedApp } from "../../src/client/injected/injected-app";
import { Chathead } from "../../src/client/chathead/Chathead";

describe("Injected App", () => {
    it("displays injected app when no project selected.", () => {
      const wrapper = mount(
        <InjectedApp
          projectId={undefined}
          debuggeeId={undefined}
          breakpoints={[]}
          lineNum={5}
          fileName={"index.js"}
          activeBreakpoints={[]}
          completedBreakpoints={[]}
        />
      );
      expect(wrapper.find(Chathead)).toHaveLength(1);
    });

    it("checks getGcpProjectId method is called", () => {
      jest.spyOn(InjectedApp.prototype, 'getGcpProjectId');
      shallow(<InjectedApp />);
      expect(InjectedApp.prototype.getGcpProjectId).toHaveBeenCalled();
    });

    it("displays injected app when no project selected.", () => {
      jest.spyOn(InjectedApp.prototype, 'getProjectNameFromGithub');
      shallow(<InjectedApp />);
      expect(InjectedApp.prototype.getProjectNameFromGithub).toHaveBeenCalled();
    });
});
  