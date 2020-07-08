import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Project } from "../../common/types/debugger";

interface SelectProjectContainerProps {
  projectId?: string;
  loadProjects: () => Promise<Project[]>;
  onChange: (projectId) => void;
}

interface SelectProjectContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  projects: Array<Project>;
  projectsLoading: boolean;
}

export class SelectProjectContainer extends React.Component<
  SelectProjectContainerProps,
  SelectProjectContainerState
> {
  constructor(props: SelectProjectContainerProps) {
    super(props);

    this.state = {
      projects: [],
      projectsLoading: false,
    };
  }

  onChange(projectId) {
    this.props.onChange(projectId);
  }

  componentDidMount() {
    this.setState({ projectsLoading: true });
    this.props.loadProjects().then((projects) => {
      this.setState({ projects, projectsLoading: false });
    });
  }

  render() {
    return (
      <>
        <h3>Select Project</h3>
        <SelectView
          options={this.state.projects}
          optionsLoading={this.state.projectsLoading}
          selectedOptionId={this.props.projectId}
          onChange={(projectId) => this.onChange(projectId)}
          optionToId={(project: Project) => project.projectId}
        />
      </>
    );
  }
}
