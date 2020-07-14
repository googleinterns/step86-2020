import React from "react";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress } from "@material-ui/core";

interface SelectViewProps {
  options: any[];
  label?: string;
  optionsLoading: boolean;
  selectedOptionId?: string;
  // Gets an ID to internally represent an option (will be stored and sent to API)
  optionToId: (option: any) => string;
  onChange: (optionId: string) => void;
}

export class SelectView extends React.Component<SelectViewProps, {}> {
  onChange(optionId) {
    console.log(optionId);
    this.props.onChange(optionId);
  }

  render() {
    const { options, selectedOptionId, optionsLoading, optionToId, label } = this.props;

    if (optionsLoading) {
      return <CircularProgress/>
    }

    const menuItems = options.map(optionToId).map(optId => <MenuItem value={optId}>{optId}</MenuItem>);

    return (
      <FormControl variant="outlined" style={{width: "100%"}}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={selectedOptionId}
          onChange={event => this.onChange(event.target.value)}
        >
          {menuItems}
        </Select>
      </FormControl>
    );
  }
}