import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Debuggee } from "../../common/types/debugger";

import { Toolbar, Typography, AppBar, Card, CardContent, Box, IconButton, Grid } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import RefreshIcon from '@material-ui/icons/Refresh';
import { BackgroundRequestError } from "../../common/requests/BackgroundRequest";
import { Appbar } from "./Appbar";

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
        <Appbar title={this.props.projectId} onBack={this.props.backToProjects}>
          {!this.state.debuggeesLoading && (
              <IconButton color="inherit" onClick={() => this.loadDebuggees()}>
                <RefreshIcon/>
              </IconButton>
            )
          }
        </Appbar>
        <Box m={4}>
          <Grid container>
            {
               (!this.state.error && !this.state.debuggeesLoading && this.state.debuggees.length === 0) ? (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    No debuggees are active. This means your project hasn't run in a while. Please make sure its active, then try again. 
                  </Alert>
                </Grid>
              ): null
            }
            {
              !this.state.error && this.state.debuggees.length ? (
                <Grid item xs={12}>
                  <SelectView
                    label="Debuggee ID"
                    options={this.state.debuggees}
                    optionsLoading={this.state.debuggeesLoading}
                    selectedOptionId={this.props.debuggeeId}
                    onChange={(debuggeeId) => this.onChange(debuggeeId)}
                    optionToId={(debuggee: Debuggee) => debuggee.id}
                    optionToLabel={(debuggee: Debuggee) => debuggee.description}
                  />
                </Grid>
              ): null
            }
            {
              this.state.error ? (
                <Grid item xs={12}>
                  <Alert severity="error">{this.state.error.message}</Alert>
                </Grid>
              ): null
            }
          </Grid>
        </Box>   
      </>
    );
  }
}
