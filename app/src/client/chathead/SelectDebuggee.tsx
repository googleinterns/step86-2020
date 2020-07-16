import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Debuggee } from "../../common/types/debugger";

import { Toolbar, Typography, AppBar, Card, CardContent, Box, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Alert from '@material-ui/lab/Alert';
import RefreshIcon from '@material-ui/icons/Refresh';
import { BackgroundRequestError } from "../../common/requests/BackgroundRequest";

interface SelectDebuggeeContainerProps {
  projectId: string;
  debuggeeId?: string;
  loadDebuggees: () => Promise<Debuggee[]>;
  onChange: (debuggeeId) => void;
  backToProjects: () => void;
}

interface SelectDebuggeeContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  debuggees: any[];
  debuggeesLoading: boolean;
  error?: BackgroundRequestError
}

export class SelectDebuggeeContainer extends React.Component<
  SelectDebuggeeContainerProps,
  SelectDebuggeeContainerState
> {
  constructor(props: SelectDebuggeeContainerProps) {
    super(props);

    this.state = {
      debuggees: [],
      debuggeesLoading: false,
    };
  }

  onChange(debuggeeId) {
    this.props.onChange(debuggeeId);
  }

  componentDidMount() {
    this.loadDebuggees();
  }

  loadDebuggees() {
    this.setState({ debuggeesLoading: true, error: undefined });
    this.props.loadDebuggees()
      .then((debuggees) => {
        this.setState({ debuggees });
      })
      .catch((error: BackgroundRequestError) => {
        this.setState({ error });
      })
      .finally(() => this.setState({debuggeesLoading: false}))
  }

  render() {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={this.props.backToProjects}>
              <ArrowBackIcon/>
            </IconButton>
            <Typography variant="h6">{this.props.projectId}</Typography>
            {!this.state.debuggeesLoading && (
                <IconButton color="inherit" onClick={() => this.loadDebuggees()}>
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
                !this.state.error && this.state.debuggees.length === 0 && (
                  <Alert severity="warning">
                    No debuggees are active. This means your project hasn't run in a while, try using it to wake it up.
                  </Alert>
                )
              }

              {
                !this.state.error && this.state.debuggees.length && (
                  <SelectView
                    label="Debuggee ID"
                    options={this.state.debuggees}
                    optionsLoading={this.state.debuggeesLoading}
                    selectedOptionId={this.props.debuggeeId}
                    onChange={(debuggeeId) => this.onChange(debuggeeId)}
                    optionToId={(debuggee: Debuggee) => debuggee.id}
                  />
                )
              }
              {
                this.state.error && (
                  <Alert severity="error">{this.state.error.message}</Alert>
                )
              }
            </CardContent>
          </Card>
        </Box>   
      </>
    );
  }
}
