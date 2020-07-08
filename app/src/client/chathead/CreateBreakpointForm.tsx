import React from "react";

interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number) => void;
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

  render() {
    const { fileName, lineNumber } = this.state;
    return (
      <form>
        <label>File Name</label>
        <input
          style={{width: "100%"}}
          data-testid="fileName"
          value={fileName}
          onChange={(e) => this.onFileName(e.target.value)}
        />

        <label>Line Number</label>
        <input
          style={{width: "100%"}}
          data-testid="lineNumber"
          value={lineNumber}
          onChange={(e) => this.onLineNumber(e.target.value)}
        />
        <button onClick={(e) => {
          e.preventDefault(); // Prevents a page reload from form submit.
          this.onCreateBreakpoint();
          }}>
          Create Breakpoint
        </button>
      </form>
    );
  }
}
