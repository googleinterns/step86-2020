import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Project } from "../../common/types/debugger";
import { AppBar, Toolbar, Typography, Card, CardContent, Box, IconButton } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import RefreshIcon from '@material-ui/icons/Refresh';
import { BackgroundRequestError } from "../../common/requests/BackgroundRequest";

interface SelectProjectContainerProps {
  projectId?: string;
  projectDescription?: string;
  loadProjects: () => Promise<Project[]>;
  onChange: (projectId) => void;
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
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Select Project</Typography>
            {!this.state.projectsLoading && (
                <IconButton color="inherit" onClick={() => this.loadProjects()}>
                  <RefreshIcon/>
                </IconButton>
              )
            }
          </Toolbar>
        </AppBar>
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
