import React from "react";
import { SelectView } from "./GeneralSelectView";
import { Debuggee } from "../../common/types/debugger";
import { Toolbar, Typography, AppBar, Card, CardContent, Box, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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
    this.setState({ debuggeesLoading: true });
    this.props.loadDebuggees().then((debuggees) => {
      this.setState({ debuggees, debuggeesLoading: false });
    });
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
          </Toolbar>
        </AppBar>
        <Box m={1}>
          <Card>
            <CardContent>
              <SelectView
                label="Debuggee ID"
                options={this.state.debuggees}
                optionsLoading={this.state.debuggeesLoading}
                selectedOptionId={this.props.debuggeeId}
                onChange={(debuggeeId) => this.onChange(debuggeeId)}
                optionToId={(debuggee: Debuggee) => debuggee.id}
              />
            </CardContent>
          </Card>
        </Box>   
      </>
    );
  }
}
