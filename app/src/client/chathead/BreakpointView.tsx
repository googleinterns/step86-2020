import React from "react";
import { Accordion, AccordionSummary, Typography, List, ListItem, ListItemText, AccordionDetails, CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorIcon from '@material-ui/icons/Error';
import { Variable, Breakpoint, FailedBreakpoint } from "../../common/types/debugger";

/** Used to display a breakpoint that has not yet hit. */
export const PendingBreakpointView = ({ breakpointMeta }) => {
  return (
    <Accordion>
      <AccordionSummary disabled expandIcon={<CircularProgress/>}>
        <LocationView breakpoint={breakpointMeta}/>
      </AccordionSummary>
    </Accordion>
  );
};

/** Used to display data for a breakpoint that has already hit. */
export const CompletedBreakpointView = ({ breakpoint }) => {
  const {status} = breakpoint;
  if (status && status.isError) {
    return <FailedCompletedBreakpointView breakpoint={breakpoint}/>;
  }
  return <SuccessfulCompletedBreakpointView breakpoint={breakpoint}/>;
};

/** Shows stackframe data for a successful breakpoint. */
export const SuccessfulCompletedBreakpointView = ({breakpoint}) => {
  const {stackFrames} = breakpoint;
  const stackframe = stackFrames[0];
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <LocationView breakpoint={breakpoint}/>
      </AccordionSummary>
      <AccordionDetails>
        <VariablesView variables={stackframe.locals}/>
      </AccordionDetails>
    </Accordion>
  );
}

/** Shows error data for a failed breakpoint. */
export const FailedCompletedBreakpointView = ({breakpoint}) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ErrorIcon/>}>
        <LocationView breakpoint={breakpoint}/>
      </AccordionSummary>
      <AccordionDetails>
        <Alert severity="error">
          {/* Currently this title causes issues with the width of the chathead */}
          {/* <AlertTitle>{status.refersTo}</AlertTitle> */}
          {getBreakpointErrorMessage(breakpoint)}
        </Alert>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * Debugger returns the error message in the form of a bash style template string.
 * Example: format = "Hello $0", parameters = ["Bob"]
 */
export function getBreakpointErrorMessage(breakpoint: FailedBreakpoint): string{
  const {status} = breakpoint;
  const {format, parameters} = status.description;
  // This Regex looks for sequences like $0, $1, ... and replaces them with the parameter for their index.
  const message = format.replace(/\$(\d+)/g, (match, index) => parameters[index]);
  return message;
}

/** Displays a set of variables from a debugger stack frame. */
export const VariablesView = ({variables}: {variables: Variable[]}) => {
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

/** Displays file name and line number for a breakpoint. */
export const LocationView = ({breakpoint}) => {
  const {location} = breakpoint;
  return (
    <Typography>{location.path}:{location.line}</Typography>
  );
}