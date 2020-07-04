import React from "react";

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
         <SelectDebugeeView
        debugees={this.state.debugees}
        debugeesLoading={this.state.debugeesLoading}
        debugeeId={this.props.debugeeId}
        onChange={(debugeeId) => this.onChange(debugeeId)}
      />
      </div>

    );
  }
}

interface SelectDebugeeViewProps {
  debugees: any[];
  debugeesLoading: boolean;
  debugeeId?: string;
  onChange: (debugeeId: string) => void;
}

export class SelectDebugeeView extends React.Component<
  SelectDebugeeViewProps,
  {}
> {
  onChange(debugeeId) {
    this.props.onChange(debugeeId);
  }

  render() {
    const { debugees, debugeeId, debugeesLoading } = this.props;
    return (
      <div>
        <h1>Select Debugee</h1>
        {debugeesLoading === true && <LoadingView />}
        {debugeesLoading === false && (
          <DebugeeSelect
            {...{
              debugeeId,
              debugees,
              onChange: (debugeeId) => this.onChange(debugeeId),
            }}
          />
        )}
      </div>
    );
  }
}

export const LoadingView = () => <div>Loading...</div>;
export const DebugeeSelect = ({ debugees, debugeeId, onChange }) => {
  return (
    <select value={debugeeId} onChange={(e) => onChange(e.target.value)}>
      {debugees.map((debugee) => (
        <DebugeeOption key={debugee} debugee={debugee} />
      ))}
    </select>
  );
};

export const DebugeeOption = ({ debugee }) => (
  <option value={debugee}>{debugee}</option>
);
