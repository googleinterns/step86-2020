import React from "react";
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
interface SelectViewProps {
  options: any[];
  label?: string;
  optionsLoading: boolean;
  selectedOptionId?: string;
  // Gets an ID to internally represent an option (will be stored and sent to API)
  optionToId: (option: any) => string;
  optionToLabel: (option: any) => string;
  onChange: (optionId: string) => void;
}

export class SelectView extends React.Component<SelectViewProps, {}> {
  onChange(optionId) {
    console.log(optionId);
    this.props.onChange(optionId);
  }

  render() {
    const { options, selectedOptionId, optionsLoading, optionToId, label, optionToLabel }  = this.props;

    if (optionsLoading) {
      return <CircularProgress/>
    }

    return (
      <FormControl variant="outlined" style={{width: "100%"}}>
        {/* <InputLabel>{label}</InputLabel> */}
        <Autocomplete
          options={options}
          fullWidth
          getOptionLabel={optionToLabel}
          getOptionSelected={(option, value) => optionToId(option) === value}
          value={selectedOptionId}
          onChange={(event, newValue) => this.onChange(optionToId(newValue))}
          renderInput={(params) => <TextField {...params} label={label} variant="outlined"/>}
        />
      </FormControl>
    );
  }
}