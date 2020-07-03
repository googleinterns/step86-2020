import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import {
  SelectProjectView,
  SelectProjectContainer,
  LoadingView,
  ProjectSelect,
  ProjectOption,
} from "../../src/client/chathead/SelectProject";

describe("SelectProjectView", () => {
  it("displays loading state", () => {
    const wrapper = shallow(
      <SelectProjectView
        projectsLoading={true}
        projects={[]}
        onChange={() => {}}
      />
    );
    expect(wrapper.find(LoadingView)).toHaveLength(1);
  });

  it("displays projects", () => {
    const wrapper = mount(
      <SelectProjectView
        projectsLoading={false}
        projects={["a", "b", "c"]}
        onChange={() => {}}
      />
    );
    // Make sure three options are displayed
    const options = wrapper.find(ProjectOption);
    expect(options).toHaveLength(3);
    expect(options.at(0).text()).toEqual("a");
  });

  it("displays selected project", () => {
    const wrapper = mount(
      <SelectProjectView
        projectsLoading={false}
        projects={["a", "b", "c"]}
        projectId={"b"}
        onChange={() => {}}
      />
    );

    // Find selected option
    expect(
      wrapper.find(ProjectSelect).first().getElement().props.projectId
    ).toEqual("b");
  });

  it("calls back on project change", () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SelectProjectView
        projectsLoading={false}
        projects={["a", "b", "c"]}
        projectId={"b"}
        onChange={spy}
      />
    );

    // Find and click option
    wrapper.find(ProjectSelect).simulate("change", { target: { value: "a" } });
    expect(spy).toHaveBeenCalledWith("a");
  });
});

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

  it("bubbles up onChange from nested SelectProjectView", async (done) => {
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
      wrapper.find(SelectProjectView).invoke("onChange")("a");
      expect(spy).toHaveBeenCalledWith("a");
      done();
    });
  });
});
