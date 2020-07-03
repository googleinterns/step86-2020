import React from "react";
import { action } from "@storybook/addon-actions";
import { SelectProjectView } from "../../src/client/chathead/SelectProject";

export default {
  title: "SelectProjectView",
  component: SelectProjectView,
};

export const Loading = () => (
  <SelectProjectView
    projectsLoading={true}
    projects={[]}
    onChange={(projectId) => action(`Project ${projectId} selected.`)()}
  />
);

export const WithProjects = () => (
  <SelectProjectView
    projectsLoading={false}
    projects={["1", "2", "3"]}
    projectId={"2"}
    onChange={(projectId) => action(`Project ${projectId} selected.`)()}
  />
);
