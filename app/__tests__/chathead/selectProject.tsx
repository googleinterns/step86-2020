import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { SelectProjectContainer } from "../../src/client/chathead/SelectProject";
import { SelectView } from "../../src/client/chathead/GeneralSelectView";
import { BackgroundRequestError } from "../../src/common/requests/BackgroundRequest";
import RefreshIcon from '@material-ui/icons/Refresh';

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

  it("hides refresh button when loading projects", () => {
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={() => new Promise((resolve) => {})}
      />
    );
    expect(wrapper.find(RefreshIcon).exists()).toEqual(false);
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

  it("shows refresh button when projects loaded", (done) => {
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={async () => []}
      />
    );

    // Wait for the loadProjects call to resolve
    setImmediate(() => {
      expect(wrapper.find(RefreshIcon).exists()).toEqual(true);
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

  it("shows error if load fails", async (done) => {
    const error = {message: "foo"} as BackgroundRequestError;
    const wrapper = shallow(
      <SelectProjectContainer
        projectId={undefined}
        loadProjects={async () => {throw error}}
      />
    );

    // Delays the expect call until the component has a change to setState
    setImmediate(() => {
      // Error message is shown
      expect(wrapper.text()).toContain("foo");
      // Select is hidden
      expect(wrapper.find(SelectView).exists()).toBe(false);
      done();
    });
  });
});
