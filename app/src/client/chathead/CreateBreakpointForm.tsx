import React from "react";
import { TextField, Card, CardContent, Button, Box } from "@material-ui/core";

interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number) => void;
  deleteAllActiveBreakpoints: () => void;
}

interface CreateBreakpointFormState {
  fileName: string;
  lineNumber: number;
  activeBreakpoints: Array<any>;
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
      activeBreakpoints: undefined,
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

  render() {
    const { fileName, lineNumber } = this.state;
    return (
      <Box m={1}>
        <Card elevation={1}>
          <CardContent>
            <form>
              <TextField
                label="File Name"
                style={{width: "100%"}}
                data-testid="fileName"
                value={fileName}
                onChange={(e) => this.onFileName(e.target.value)}
                variant="outlined"
              />
              <br/><br/>
              <TextField
                label="Line Number"
                style={{width: "100%"}}
                data-testid="lineNumber"
                value={lineNumber}
                onChange={(e) => this.onLineNumber(e.target.value)}
                variant="outlined"
              />
              <br/><br/>
              <Button onClick={(e) => {
                e.preventDefault(); // Prevents a page reload from form submit.
                this.onCreateBreakpoint();
                }}>
                Create Breakpoint
              </Button>
              <Button onClick={(e) => {
                e.preventDefault(); // Prevents a page reload from form submit.
                this.onDeleteAllActiveBreakpoints();
                }}>
                Delete all active breakpoints
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>      
    );
  }
}
