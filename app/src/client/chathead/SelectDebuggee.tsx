import React from "react";
import { SelectView } from "./GeneralSelectView";

interface SelectDebuggeeContainerProps {
  projectId: string;
  debuggeeId?: string;
  loadDebuggees: () => Promise<any[]>;
  onChange: (debuggeeId) => void;
}

interface SelectDebuggeeContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  debuggees: any[]; // TODO: Create a Project type
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
      <div>
        <span>Project: {this.props.projectId}</span>
        <h3>Select Debuggee</h3>
        <SelectView
          options={this.state.debuggees}
          optionsLoading={this.state.debuggeesLoading}
          optionId={this.props.debuggeeId}
          onChange={(debuggeeId) => this.onChange(debuggeeId)}
        />
      </div>
    );
  }
}
