import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Project } from "../../common/types/debugger";
import { Toolbar, Typography, Card, CardContent, Box, IconButton } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import { BackgroundRequestError } from "../../common/requests/BackgroundRequest";
import { Appbar } from "./Appbar";

interface SelectProjectContainerProps {
  projectId?: string;
  loadProjects: () => Promise<Project[]>;
  onChange: (projectId) => void;
  toggleMinimized: () => void;
  toggleMaximized: () => void;
}

interface SelectProjectContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  projects: Array<Project>;
  projectsLoading: boolean;
  error?: BackgroundRequestError
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
    this.loadProjects();
  }

  loadProjects() {
    this.setState({ projectsLoading: true, error: undefined });
    this.props.loadProjects()
      .then((projects) => {
        this.setState({ projects});
      })
      .catch((error: BackgroundRequestError) => {
        this.setState({error});
      })
      .finally(() => this.setState({projectsLoading: false}));
  }

  render() {
    return (
      <>
        <Appbar
          title="Select Project"
          onRefresh={!this.state.projectsLoading && (() => this.loadProjects())}d
        />
        <Box m={1}>
          <Card>
            <CardContent>
              {
                !this.state.error && (
                  <SelectView
                    label="Project ID"
                    options={this.state.projects}
                    optionsLoading={this.state.projectsLoading}
                    selectedOptionId={this.props.projectId}
                    onChange={(projectId) => this.onChange(projectId)}
                    optionToId={(project: Project) => project.projectId}
                    optionToLabel={(project: Project) => project.projectId}
                  />
                )
              }
              {
                this.state.error && <Alert severity="error">{this.state.error.message}</Alert>
              }
            </CardContent>
          </Card>
        </Box>
        
      </>
    );
  }
}
