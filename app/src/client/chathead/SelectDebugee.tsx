import React from "react";
import { SelectView } from "./GeneralSelectView";

interface SelectDebugeeContainerProps {
  projectId: string;
  debugeeId?: string;
  loadDebugees: () => Promise<any[]>;
  onChange: (debugeeId) => void;
}

interface SelectDebugeeContainerState {
  /** All projects this user has access to, loaded using FetchProjectsRequest */
  debugees: any[]; // TODO: Create a Project type
  debugeesLoading: boolean;
}

export class SelectDebugeeContainer extends React.Component<
  SelectDebugeeContainerProps,
  SelectDebugeeContainerState
> {
  constructor(props: SelectDebugeeContainerProps) {
    super(props);

    this.state = {
      debugees: [],
      debugeesLoading: false,
    };
  }

  onChange(debugeeId) {
    this.props.onChange(debugeeId);
  }

  componentDidMount() {
    this.setState({ debugeesLoading: true });
    this.props.loadDebugees().then((debugees) => {
      this.setState({ debugees, debugeesLoading: false });
    });
  }

  render() {
    return (
      <div>
        <span>Project: {this.props.projectId}</span>
        <h3>Select Debugee</h3>
        <SelectView
          options={this.state.debugees}
          optionsLoading={this.state.debugeesLoading}
          optionId={this.props.debugeeId}
          onChange={(debugeeId) => this.onChange(debugeeId)}
        />
      </div>
    );
  }
}
