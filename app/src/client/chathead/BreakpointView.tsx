import React from "react";
import { Accordion, AccordionSummary, Typography, List, ListItem, ListItemText, AccordionDetails, CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorIcon from '@material-ui/icons/Error';
import { Variable } from "../../common/types/debugger";

/** Used to display a breakpoint that has not yet hit. */
export const PendingBreakpointView = ({ breakpointMeta }) => {
  const {location} = breakpointMeta;
  return (
    <Accordion>
      <AccordionSummary disabled expandIcon={<CircularProgress/>}>
        <Typography>{location.path}:{location.line}</Typography>
      </AccordionSummary>
    </Accordion>
  );
};

/** Used to display data for a breakpoint that has already hit. */
export const CompletedBreakpointView = ({ breakpoint }) => {
  console.log(breakpoint);
  const {status} = breakpoint;
  if (status && status.isError) {
    return <FailedCompletedBreakpointView breakpoint={breakpoint}/>;
  }
  return <SuccessfulCompletedBreakpointView breakpoint={breakpoint}/>;
};

/** Shows stackframe data for a successful breakpoint. */
export const SuccessfulCompletedBreakpointView = ({breakpoint}) => {
  const {stackFrames, location} = breakpoint;
  const stackframe = stackFrames[0];
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography>{location.path}:{location.line}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <VariablesView variables={stackframe.locals}/>
      </AccordionDetails>
    </Accordion>
  );
}

/** Shows error data for a failed breakpoint. */
export const FailedCompletedBreakpointView = ({breakpoint}) => {
  const {location, status} = breakpoint;
  // Debugger returns the error message in the form of a bash style template string.
  // Example: format = "Hello $0", parameters = ["Bob"]
  const {format, parameters} = status.description;
  // This Regex looks for sequences like $0, $1, ... and replaces them with the parameter for their index.
  const message = format.replace(/\$({\d}+)/, (match, index) => parameters[index]);
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ErrorIcon/>}>
        <Typography>{location.path}:{location.line}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Alert severity="error">
          {/* Currently this title causes issues with the width of the chathead */}
          {/* <AlertTitle>{status.refersTo}</AlertTitle> */}
          {message}
        </Alert>
      </AccordionDetails>
    </Accordion>
  );
}

/** Displays a set of variables from a debugger stack frame. */
const VariablesView = ({variables}: {variables: Variable[]}) => {
  return (
    <List dense>
      {
        variables.map(variable => (
          <ListItem>
            <ListItemText primary={variable.name} secondary={variable.value}/>
          </ListItem>
        ))
      }
    </List>
  )
}