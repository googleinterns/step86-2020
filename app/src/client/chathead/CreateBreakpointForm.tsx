import React, { Component } from "react";
import { TextField, Card, CardContent, Button, Box, List, ListItem, ListItemSecondaryAction, IconButton, ListItemText, OutlinedInput, InputAdornment, AccordionSummary, Typography, AccordionDetails, Accordion, AccordionActions, Divider, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import Alert from '@material-ui/lab/Alert';
        
interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number, condition: string, expressions: string[]) => void;
  deleteAllActiveBreakpoints: () => void;
  activeBreakpoints: BreakpointMeta[];
  completedBreakpoints:Breakpoint[];
}

interface CreateBreakpointFormState {
  fileName: string;
  lineNumber: number;
  condition: string;
  expressions: string[];
  errorMessage: string;
}

export class CreateBreakpointForm extends React.Component<
  CreateBreakpointFormProps,
  CreateBreakpointFormState
> {
  constructor(props: CreateBreakpointFormProps) {
    super(props);
    this.state = {
      fileName: undefined,
      lineNumber: undefined,
      condition: "",
      expressions: [],
      errorMessage: undefined
    };
  }

  onFileName(fileName) {
    this.setState({ fileName });
    this.setState({ errorMessage: undefined });
  }

  onLineNumber(lineNumber) {
    this.setState({ lineNumber });
    this.setState({ errorMessage: undefined });
  }

  onCreateBreakpoint() {
    this.props.createBreakpoint(this.state.fileName, this.state.lineNumber, this.state.condition, this.state.expressions);
  }

  onDeleteAllActiveBreakpoints() {
    this.props.deleteAllActiveBreakpoints();
  }

  /** Checks for the valid breakpoint. If the breakpoint already exists in active or completed list*/
  checkValidBreakpoint() {
    // Loop through the lists and check active list
    for (let breakpoint of this.props.activeBreakpoints) {
      // if the breakpoint already exists, return false
      if (
        breakpoint.location.path == this.state.fileName &&
        breakpoint.location.line == this.state.lineNumber
      ) {
        return false;
      }
    }
    // loop through the completed list and check
    for (let breakpoint of this.props.completedBreakpoints) {
      if (
        breakpoint.location.path == this.state.fileName &&
        breakpoint.location.line == this.state.lineNumber
      ) {
        return false;
      }
    }

    return true;
  }

  /** Compares the activeBreakpoint list to update the error message in chathead if existed */
  componentDidUpdate(prevProps) {
    if (this.props.activeBreakpoints.length > prevProps.activeBreakpoints.length) {
      this.setState({ errorMessage: undefined });
    }
  }


  render() {
    const { fileName, lineNumber, condition, expressions } = this.state;
    return (
      <Box m={1}>
        <Accordion>
          <AccordionSummary>
            <Typography variant="body2">Create Breakpoint</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    label="File Name"
                    style={{ width: "100%" }}
                    data-testid="fileName"
                    value={fileName}
                    onChange={(e) => this.onFileName(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Line Number"
                    style={{ width: "100%" }}
                    data-testid="lineNumber"
                    value={lineNumber}
                    onChange={(e) => this.onLineNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <ConditionAndExpressionsForm
                    condition={condition}
                    expressions={expressions}
                    setCondition={condition => this.setState({condition})}
                    setExpressions={expressions => this.setState({expressions})}
                  />
                </Grid>
              </Grid>
              
              
              {this.state.errorMessage !== undefined && (
                <Card>
                  <CardContent>
                    <Alert severity="error">{this.state.errorMessage}</Alert>
                  </CardContent>
                </Card>
              )}
            </form>
          </AccordionDetails>
          <Divider/>
          <AccordionActions>
            <Button
              id='createBpButton'
              onClick={(e) => {
                e.preventDefault(); // Prevents a page reload from form submit.
                if (this.checkValidBreakpoint()) {
                  this.onCreateBreakpoint();
                  this.setState({ errorMessage: undefined });
                } else {
                  this.setState({
                    errorMessage:
                      "The breakpoint on file: " +
                      this.state.fileName +
                      " and line number: " +
                      this.state.lineNumber +
                      " already exists",
                  });
                }}}
              >
                Create Breakpoint
              </Button>
              <Button
                id="deleteActiveBpButton"
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  this.onDeleteAllActiveBreakpoints();
                  this.setState({ errorMessage: undefined });
                }}
              >
                Delete all active breakpoints
              </Button>
          </AccordionActions>
        </Accordion>
      </Box>
    );
  }
}

interface ConditionAndExpressionsFormProps {
  condition: string;
  expressions: string[];
  setCondition: (condition: string) => void;
  setExpressions: (expressions: string[]) => void;
}

/** A collapsible form to enter a condition and expression(s) for the current breakpoint. */
export class ConditionAndExpressionsForm extends Component<ConditionAndExpressionsFormProps> {
  setCondition(condition: string) {
    this.props.setCondition(condition);
  }

  setExpressions(expressions: string[]) {
    this.props.setExpressions(expressions);
  }

  render() {
    const {condition, expressions} = this.props;
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant="body2">Condition and Expressions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <TextField
              label="Condition"
              size="small"
              fullWidth
              variant="outlined"
              value={condition}
              onChange={e => this.setCondition(e.target.value)}
            />
            <ExpressionsList expressions={expressions} setExpressions={expressions => this.setExpressions(expressions)}/>
          </List>
        </AccordionDetails>
      </Accordion>
    )
  }
}

interface ExpressionsListProps {
  expressions: string[];
  setExpressions: (expressions: string[]) => void;
}
/** A list of expressions, including add/delete functionality. */
export const ExpressionsList = ({expressions, setExpressions}: ExpressionsListProps) => {
  return (
    <List>
      {
        expressions.map((expression, index) => (
          <ExpressionView
            expression={expression}
            onChange={updatedExpression => {
              // Deep copy expressions, update specific index.
              const updatedExpressions = [...expressions];
              updatedExpressions[index] = updatedExpression;
              setExpressions(updatedExpressions);
            }}
            onDelete={() => {
              // Deep copy expressions and delete specific entry.
              const updatedExpressions = [...expressions];
              updatedExpressions.splice(index, 1);
              setExpressions(updatedExpressions);
            }}
          />
        ))
      }
      <Button size="small" onClick={() => setExpressions([...expressions, ""])}>Add Expression</Button>
    </List>
  );
}

interface ExpressionViewProps {
  expression: string;
  onDelete: () => void;
  onChange: (expression: string) => void;

}

/** A single expression input. */
export class ExpressionView extends Component<ExpressionViewProps> {
  onChange(expression) {
    this.props.onChange(expression);
  }

  onDelete() {
    this.props.onDelete();
  }

  render() {
    return (
      <ListItem>
        <TextField
          size="small"
          label="Expression"
          variant="outlined"
          value={this.props.expression}
          onChange={e => this.onChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => this.onDelete()}>
                  <DeleteIcon/>
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </ListItem>
    )
  }
}