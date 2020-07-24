import React from "react";
import { TextField, Card, CardContent, Button, Box } from "@material-ui/core";
import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import Alert from '@material-ui/lab/Alert';

interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number) => void;
  deleteAllActiveBreakpoints: () => void;
  activeBreakpoints: BreakpointMeta[];
  completedBreakpoints:Breakpoint[];
}

interface CreateBreakpointFormState {
  fileName: string;
  lineNumber: number;
  errorMessage: string;
}

export class CreateBreakpointForm extends React.Component<
  CreateBreakpointFormProps,
  CreateBreakpointFormState
> {
  constructor(props: CreateBreakpointFormProps) {
    super(props);
    this.state = {
      fileName: undefined,
      lineNumber: undefined,
      errorMessage: undefined
    };
  }

  onFileName(fileName) {
    this.setState({ fileName });
    this.setState({ errorMessage: undefined });
  }

  onLineNumber(lineNumber) {
    this.setState({ lineNumber });
    this.setState({ errorMessage: undefined });
  }

  onCreateBreakpoint() {
    this.props.createBreakpoint(this.state.fileName, this.state.lineNumber);
  }

  onDeleteAllActiveBreakpoints() {
    this.props.deleteAllActiveBreakpoints();
  }

  /** Checks for the valid breakpoint. If the breakpoint already exists in active or completed list*/
  checkValidBreakpoint() {
    // Loop through the lists and check active list
    for (let breakpoint of this.props.activeBreakpoints) {
      // if the breakpoint already exists, return false
      if (
        breakpoint.location.path == this.state.fileName &&
        breakpoint.location.line == this.state.lineNumber
      ) {
        return false;
      }
    }
    // loop through the completed list and check
    for (let breakpoint of this.props.completedBreakpoints) {
      if (
        breakpoint.location.path == this.state.fileName &&
        breakpoint.location.line == this.state.lineNumber
      ) {
        return false;
      }
    }

    return true;
  }

  /** Compares the activeBreakpoint list to update the error message in chathead if existed */
  componentDidUpdate(prevProps) {
    if (this.props.activeBreakpoints.length > prevProps.activeBreakpoints.length) {
      this.setState({ errorMessage: undefined });
    }
  }


  render() {
    const { fileName, lineNumber } = this.state;
    return (
      <Box m={1}>
        <Card elevation={1}>
          <CardContent>
            <form>
              
              <TextField
                label="File Name"
                style={{ width: "100%" }}
                data-testid="fileName"
                value={fileName}
                onChange={(e) => this.onFileName(e.target.value)}
                variant="outlined"
              />
              <br />
              <br />
              <TextField
                label="Line Number"
                style={{ width: "100%" }}
                data-testid="lineNumber"
                value={lineNumber}
                onChange={(e) => this.onLineNumber(e.target.value)}
                variant="outlined"
              />
              <br />
              <br />
              <Button id='createBpButton'
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  if (this.checkValidBreakpoint()) {
                    this.onCreateBreakpoint();
                    this.setState({ errorMessage: undefined });
                  } else {
                    this.setState({ errorMessage: "ERROR" });
                  }
                }}
              >
                Create Breakpoint
              </Button>
              <Button id='deleteActiveBpButton'
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  this.onDeleteAllActiveBreakpoints();
                  this.setState({ errorMessage: undefined });
                }}
              >
                Delete all active breakpoints
              </Button>
                { this.state.errorMessage === "ERROR" && (
                <Card>
                    <CardContent>
                      {
                          <Alert severity="error">{                      
                            "The breakpoint on file: " +
                          this.state.fileName
                      } <br/> {" and line number: " +
                          this.state.lineNumber +
                          " already exists"}</Alert>
                      }
                    </CardContent>
                  </Card>
                )
            }
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }
}
