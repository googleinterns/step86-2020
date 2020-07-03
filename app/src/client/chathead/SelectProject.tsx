import React from "react";

interface SelectProjectContainerProps {
  projectId?: string;
  loadProjects: () => Promise<any[]>;
  onChange: (projectId) => void;
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
      <SelectProjectView
        projects={this.state.projects}
        projectsLoading={this.state.projectsLoading}
        projectId={this.props.projectId}
        onChange={(projectId) => this.onChange(projectId)}
      />
    );
  }
}

interface SelectProjectViewProps {
  projects: any[];
  projectsLoading: boolean;
  projectId?: string;
  onChange: (projectId: string) => void;
}

export class SelectProjectView extends React.Component<
  SelectProjectViewProps,
  {}
> {
  onChange(projectId) {
    this.props.onChange(projectId);
  }

  render() {
    const { projects, projectId, projectsLoading } = this.props;
    return (
      <div>
        {projectsLoading === true && <LoadingView />}
        {projectsLoading === false && (
          <ProjectSelect
            {...{
              projectId,
              projects,
              onChange: (projectId) => this.onChange(projectId),
            }}
          />
        )}
      </div>
    );
  }
}

export const LoadingView = () => <div>Loading...</div>;
export const ProjectSelect = ({ projects, projectId, onChange }) => {
  return (
    <select value={projectId} onChange={(e) => onChange(e.target.value)}>
      {projects.map((project) => (
        <ProjectOption key={project} project={project} />
      ))}
    </select>
  );
};

export const ProjectOption = ({ project }) => (
  <option value={project}>{project}</option>
);
