import React from "react";
import { shallow, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

import { SelectProjectView } from "../../src/client/chathead/SelectProject";


describe ("SelectProjectView", () => {
    it("displays loading state", () => {
        const wrapper = shallow(
          <SelectProjectView
            projectsLoading={true}
            projects={[]}
            onChange={() => {}}
          />
        );
        expect(wrapper.find('[data-testid="projectsLoading"]')).toHaveLength(1);
    });

    it("displays projects", () => {
        const wrapper = shallow(
          <SelectProjectView
            projectsLoading={false}
            projects={["a", "b", "c"]}
            onChange={() => {}}
          />
        );
        // Make sure three options are displayed
        const options = wrapper.find('option');
        expect(options).toHaveLength(3);
        expect(options.at(0).text()).toEqual("a");
    });

    it("displays selected project", () => {
        const wrapper = render(
          <SelectProjectView
            projectsLoading={false}
            projects={["a", "b", "c"]}
            projectId={"b"}
            onChange={() => {}}
          />
        );

        // Find selected option
        const selectedOption = wrapper.find('option[selected]');
        expect(selectedOption.text()).toEqual("b");
    });

    it("calls back on project change", () => {
        const spy = jest.fn();
        const wrapper = shallow(
          <SelectProjectView
            projectsLoading={false}
            projects={["a", "b", "c"]}
            projectId={"b"}
            onChange={spy}
          />
        );

        // Find and click option
        wrapper.find('select').simulate("change", {target: {value: "a"}});
        expect(spy).toHaveBeenCalledWith("a");
    });
});