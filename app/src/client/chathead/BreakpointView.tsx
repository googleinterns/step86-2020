import React from "react";
import { Accordion, AccordionSummary, Typography, List, ListItem, ListItemText, AccordionDetails, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
  )
};

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