import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { SelectProjectContainer } from "../../src/client/chathead/SelectProject";
import { SelectView } from "../../src/client/chathead/GeneralSelectView";

describe("SelectProjectContainer", () => {
  it("loads projects when mounted", () => {
    const loadProjectsSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={loadProjectsSpy}
      />
    );
    expect(loadProjectsSpy).toHaveBeenCalledTimes(1);
  });

  it("goes into loading state when loading projects", () => {
    const loadProjectsSpy = jest.fn(() => new Promise((resolve) => {}));
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={loadProjectsSpy}
      />
    );
    expect(wrapper.state().projectsLoading).toEqual(true);
  });

  it("moves projects to state once loaded", async (done) => {
    const mockProjects = ["a", "b", "c"];
    const loadProjectsSpy = jest.fn(async () => mockProjects);
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={loadProjectsSpy}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      expect(wrapper.state()).toEqual({
        projects: mockProjects,
        projectsLoading: false,
      });
      done();
    });
  });

  it("bubbles up onChange from nested SelectView", async (done) => {
    const spy = jest.fn();
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={async () => ["a", "b", "c"]}
        onChange={spy}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      wrapper.find(SelectView).invoke("onChange")("a");
      expect(spy).toHaveBeenCalledWith("a");
      done();
    });
  });
});
