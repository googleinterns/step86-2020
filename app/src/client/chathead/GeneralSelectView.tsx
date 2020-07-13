import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

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
    return (
      <div>
        {optionsLoading === true && <LoadingView />}
        {optionsLoading === false && (
          <FormControl variant="outlined" style={{width: "100%"}}>
            <InputLabel>{label}</InputLabel>
            <Select
              value={selectedOptionId}
              onChange={event => this.onChange(event.target.value)}
            >
              {
                options.map(optionToId).map(opt => <MenuItem value={opt}>{opt}</MenuItem>)
              }
            </Select>
          </FormControl>
        )}
      </div>
    );
  }
}

export const LoadingView = () => <div>Loading...</div>;

export const OptionSelect = ({ options, selectedOptionId, onChange, optionToId }) => {
  // We use a default value of -1 to force allow selection of the 0th element.
  return (
    <select value={selectedOptionId || -1} onChange={(e) => onChange(e.target.value)}>
      <option value={-1} disabled>None Selected</option>
      {options.map((option) => (
        <Option key={optionToId(option)} option={optionToId(option)} />
      ))}
    </select>
  );
};

export const Option = ({ option }) => <option value={option}>{option}</option>;
