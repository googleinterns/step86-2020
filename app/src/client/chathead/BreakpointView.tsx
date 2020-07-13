import React from "react";
import { Accordion, AccordionSummary, Typography, List, ListItem, ListItemText, AccordionDetails, CircularProgress } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/** Used to display a breakpoint that has not yet hit. */
export const PendingBreakpointView = ({ breakpointMeta }) => (
  <Accordion>
    <BreakpointHeader
      id={breakpointMeta.id}
      location={breakpointMeta.location}
    />
    <AccordionDetails>
      <CircularProgress/>
    </AccordionDetails>
  </Accordion>
);

/** Used to display data for a breakpoint that has already hit. */
export const CompletedBreakpointView = ({ breakpoint }) => {
  //console.log(breakpoint);
  const stackframe = breakpoint.stackFrames[0];
  return (
    <Accordion>
      <BreakpointHeader id={breakpoint.id} location={breakpoint.location} />
      <AccordionDetails>
        <List>
          {
            stackframe.locals.map(variable => (
              <ListItem>
                <ListItemText primary={variable.name} secondary={variable.value}/>
              </ListItem>
            ))
          }
        </List>
      </AccordionDetails>
    </Accordion>
  )
};

const BreakpointHeader = ({ id, location }) => (
  <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
    <Typography>{location.path}</Typography>
    {/* <span>{location.path}</span>
    <span>{location.line}</span> */}
  </AccordionSummary>
);
