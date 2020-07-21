import React from "react";
import { TextField, Card, CardContent, Button, Box } from "@material-ui/core";
import { BreakpointMeta } from "../../common/types/debugger";
import Alert from '@material-ui/lab/Alert';


interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number) => void;
  deleteAllActiveBreakpoints: () => void;
  activeBreakpoints: BreakpointMeta[];

}

interface CreateBreakpointFormState {
  fileName: string;
  lineNumber: number;
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
    };
  }

  onFileName(fileName) {
    this.setState({ fileName });
  }

  onLineNumber(lineNumber) {
    this.setState({ lineNumber });
  }

  onCreateBreakpoint() {
    this.props.createBreakpoint(this.state.fileName, this.state.lineNumber);
  }

  onDeleteAllActiveBreakpoints() {
    this.props.deleteAllActiveBreakpoints();
  }
  checkValidBreakpoint(){
    for (let breakpoint of this.props.activeBreakpoints) {
      if (breakpoint.location.path == this.state.fileName && breakpoint.location.line == this.state.lineNumber) {
          return false;
      }
    }
    return true;
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
              <br/><br/>
              <Button id='createBpButton' onClick={(e) => {
                e.preventDefault(); // Prevents a page reload from form submit.
                if (this.checkValidBreakpoint()){
                  this.onCreateBreakpoint();
                } else {
                  alert("The breakpoint on file: "+ this.state.fileName + " and line number: "+ this.state.lineNumber+ " already exists");
                };
                }}>
                Create Breakpoint
              </Button>
              <Button id='deleteActiveBpButton'
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  this.onDeleteAllActiveBreakpoints();
                }}
              >
                Delete all active breakpoints
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }
}
