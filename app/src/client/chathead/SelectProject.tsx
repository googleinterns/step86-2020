import React from "react";

interface SelectProjectContainerProps {
  projectId?: string;
}

interface SelectProjectContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  projects: any[]; // TODO: Create a Project type
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

  render() {
    return (
      <SelectProjectView
        projects={this.state.projects}
        projectsLoading={this.state.projectsLoading}
        projectId={this.props.projectId}
      />
    );
  }
}

interface SelectProjectViewProps {
  projects: any[];
  projectsLoading: boolean;
  projectId?: string;
}

export class SelectProjectView extends React.Component<SelectProjectViewProps, {}> {
  render() {
    return (
      <div>
        {this.props.projectsLoading === true && (
          <span>Loading Projects...</span>
        )}
        {this.props.projectsLoading === false && (
          <select value={this.props.projectId}>
            {this.props.projects.map((project) => (
              <option value={project}>{project}</option>
            ))}
          </select>
        )}
      </div>
    );
  }
}
