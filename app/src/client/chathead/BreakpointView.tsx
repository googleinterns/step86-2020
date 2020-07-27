import React from "react";

import { Accordion, AccordionSummary, Typography, List, ListItem, ListItemText, AccordionDetails, CircularProgress, Divider, AccordionActions, Button, Box } from "@material-ui/core";
import { Alert, AlertTitle, TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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

interface CompletedBreakpointViewProps {
  breakpoint: Breakpoint;
  /** Callback to delete a breakpoint from cloud debugger. */
  deleteBreakpoint: (breakpointId: string) => void;
}
  
/** Used to display data for a breakpoint that has already hit. */
export const CompletedBreakpointView = ({ breakpoint, deleteBreakpoint }: CompletedBreakpointViewProps) => {
  const {status} = breakpoint;
  if (status && status.isError) {
    return <FailedCompletedBreakpointView breakpoint={breakpoint} deleteBreakpoint={deleteBreakpoint}/>;
  }
  return <SuccessfulCompletedBreakpointView breakpoint={breakpoint} deleteBreakpoint={deleteBreakpoint}/>;
};

/** Shows stackframe data for a successful breakpoint. */
export const SuccessfulCompletedBreakpointView = ({ breakpoint, deleteBreakpoint }: CompletedBreakpointViewProps) => {
  const {stackFrames} = breakpoint;
  console.log(breakpoint);
  const stackframe = stackFrames[0];
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <LocationView breakpoint={breakpoint}/>
      </AccordionSummary>
      <AccordionDetails>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {
            stackFrames.slice(0, 3).map(stackFrame => <StackFrame stackFrame={stackFrame} breakpoint={breakpoint}/>)
          }
        </TreeView>
      </AccordionDetails>
      <Divider/>
      <AccordionActions>
        <Button size="small" color="secondary" onClick={() => deleteBreakpoint(breakpoint.id)}>Delete</Button>
      </AccordionActions>
    </Accordion>
  );
}

const StackFrame = ({stackFrame, breakpoint}) => {
  const {variableTable} = breakpoint;
  return (
    <TreeItem nodeId={stackFrame.function} label={stackFrame.function}>
      {
        stackFrame.locals && stackFrame.locals.map(variable => (
          <VariableView
            parentNode={stackFrame.function}
            variable={variable}
            variableTable={variableTable}/>
        ))
      }
    </TreeItem>
  );
}

export const VariableView = ({parentNode, variable, variableTable}) => {
  const name = variable.name;
  const isInVarTable = variable.varTableIndex !== undefined;
  const varTableData = isInVarTable && variableTable[variable.varTableIndex];

  const {type} = isInVarTable ? varTableData : variable;
  const nodeId = parentNode + variable.name;

  const [isExpanded, setIsExpanded] = React.useState(false); 

  return (
    <TreeItem
      nodeId={nodeId}
      onClick={() => setIsExpanded(!isExpanded)}
      label={(
        <Typography component="div">
          <Box fontWeight="fontWeightMedium" display="inline">
            {name}
          </Box>
          <Box fontWeight="fontWeightRegular" display="inline">
            {` (${type})`}
          </Box>
          {
            !isInVarTable && (
              <Box fontWeight="fontWeightRegular" display="inline">
                {`: ${variable.value}`}
              </Box>
            )
          }
        </Typography>
      )}
    >
      {isInVarTable && (
        isExpanded ?
          varTableData.members.map(variable => <VariableView variable={variable} parentNode={nodeId} variableTable={variableTable}/>)
        : <TreeItem nodeId={nodeId + "childDummy"}/>
      )}
    </TreeItem>
  )
}

/** Shows error data for a failed breakpoint. */
export const FailedCompletedBreakpointView = ({ breakpoint, deleteBreakpoint }: CompletedBreakpointViewProps) => {
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
      <Divider/>
      <AccordionActions>
        <Button size="small" color="secondary" onClick={() => deleteBreakpoint(breakpoint.id)}>Delete</Button>
      </AccordionActions>
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
