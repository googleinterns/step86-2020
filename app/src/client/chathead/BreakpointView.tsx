import React from "react";

import { Accordion, AccordionSummary, Typography, AccordionDetails, CircularProgress, Divider, AccordionActions, Button, Box, Grid } from "@material-ui/core";
import { Alert, AlertTitle, TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ErrorIcon from '@material-ui/icons/Error';
import { Variable, Breakpoint, FailedBreakpoint } from "../../common/types/debugger";

/** Used to display a breakpoint that has not yet hit. */
export const PendingBreakpointView = ({ breakpointMeta, deleteBreakpoint }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Grid container spacing={3}>
          <Grid item xs={11}>
            <LocationView breakpoint={breakpointMeta}/>
          </Grid>
          <Grid item xs={1}>
            <CircularProgress size={20}/>
          </Grid>
        </Grid>
      </AccordionSummary>
      <Divider/>
      <AccordionActions>
        <Button size="small" color="secondary" onClick={() => deleteBreakpoint(breakpointMeta.id)}>Delete</Button>
      </AccordionActions>
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
  if (!breakpointIsSuccessful(breakpoint)) {
    return <FailedCompletedBreakpointView breakpoint={breakpoint} deleteBreakpoint={deleteBreakpoint}/>;
  }
  return <SuccessfulCompletedBreakpointView breakpoint={breakpoint} deleteBreakpoint={deleteBreakpoint}/>;
};

/** Shows stackframe data for a successful breakpoint. */
export const SuccessfulCompletedBreakpointView = ({ breakpoint, deleteBreakpoint }: CompletedBreakpointViewProps) => {
  console.log(breakpoint);
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <LocationView breakpoint={breakpoint}/>
      </AccordionSummary>
      <AccordionDetails>
        <SuccessfulCompletedBreakpointData breakpoint={breakpoint}/>
      </AccordionDetails>
      <Divider/>
      <AccordionActions>
        <Button size="small" color="secondary" onClick={() => deleteBreakpoint(breakpoint.id)}>Delete</Button>
      </AccordionActions>
    </Accordion>
  );
}

/** Stacktrace and expression data for a successful breakpoint. */
export const SuccessfulCompletedBreakpointData = ({breakpoint}) => {
  const {stackFrames, evaluatedExpressions, variableTable} = breakpoint;
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {
        evaluatedExpressions && (
          <TreeItem nodeId="expressions" label="Expressions">
            {evaluatedExpressions.map(expression => <VariableView variable={expression} parentNode={"expressions"} variableTable={variableTable}/>)}
          </TreeItem>
        )
      }
      <TreeItem nodeId="stackframes" label="Stackframes">
        {
          stackFrames.map(stackFrame => <StackFrame stackFrame={stackFrame} breakpoint={breakpoint}/>)
        }
      </TreeItem>
    </TreeView>
  )
}

/** Error data for failed breakpoint. */
export const FailedCompletedBreakpointData = ({breakpoint}) => {
  return (
    <Alert severity="error">
      {/* Currently this title causes issues with the width of the chathead */}
      {/* <AlertTitle>{status.refersTo}</AlertTitle> */}
      {getBreakpointErrorMessage(breakpoint)}
    </Alert>
  );
}

/** A single stackframe (closure context) of variables. */
export const StackFrame = ({stackFrame, breakpoint}) => {
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

/** Show data for a single variable in the stacktrace.
 *  These can be nested to show nested variables in array or object.
 */
export const VariableView = ({parentNode, variable, variableTable}) => {
  // Used to not render children until needed.
  const [isExpanded, setIsExpanded] = React.useState(false);

  const name = variable.name;
  // Data for complex objects is normalized within the vartable.  
  const isComplex = variable.varTableIndex !== undefined;
  const data = isComplex && variableTable[variable.varTableIndex];
  // Based on whether this is simple or complex, type is stored in different place.
  const {type} = isComplex ? data : variable;
  // MaterialUI needs a unique ID for each node. This should work.
  const nodeId = parentNode + variable.name;

  // By default, there are no child nodes.
  let children = null;
  // Only complex objects have children.
  if (isComplex) {
    // Only show children if expanded, to save memory.
    if (isExpanded) {
      children = data.members.map(variable => (
        <VariableView
          variable={variable}
          parentNode={nodeId}
          variableTable={variableTable}/>
      ));
    } else {
      // If not expanded, we add a dummy child. This forces material-ui to show the "expand" icon.
      children = <TreeItem nodeId={nodeId + "placeholderChild"}/>
    }
  }

  return (
    <TreeItem
      nodeId={nodeId}
      onClick={e => {
        // Stop propagation, otherwise children clicks bubble up.
        // This means a child object being opened/closed can affect this node/
        // That makes the state go haywire and makes things not present right.
        e.stopPropagation();
        // Toggle expansion
        setIsExpanded(!isExpanded)
      }}
      label={<VariableLabel name={name} type={type} value={variable.value}/>}
    >
      {children}
    </TreeItem>
  )
}

/** Displays name, type, and (if provided) value for variables in a stack tree.
 *  "value" is not applicable for complex structures (e.g array, object)
 *  since their value is provided as nested children.
 */
export const VariableLabel = ({name, type, value}) => (
  <Typography component="div">
    <Box fontWeight="fontWeightMedium" display="inline">
      {name}
    </Box>
    {type && (
      <Box fontWeight="fontWeightRegular" display="inline">
        {` (${type})`}
      </Box>
    )}

    {
      value && (
        <Box fontWeight="fontWeightRegular" display="inline">
          {`: ${value}`}
        </Box>
      )
    }
  </Typography>
)

/** Shows error data for a failed breakpoint. */
export const FailedCompletedBreakpointView = ({ breakpoint, deleteBreakpoint }: CompletedBreakpointViewProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ErrorIcon/>}>
        <LocationView breakpoint={breakpoint}/>
      </AccordionSummary>
      <AccordionDetails>
        <FailedCompletedBreakpointData breakpoint={breakpoint}/>
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

/** Displays file name and line number for a breakpoint. */
export const LocationView = ({breakpoint}) => {
  const {location} = breakpoint;
  return (
    <Typography>{location.path}:{location.line}</Typography>
  );
}

/** Whether a breakpoint is successful or failed. */
export function breakpointIsSuccessful(breakpoint) {
  const {status} = breakpoint;
  return !status || !status.isError;
}