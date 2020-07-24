import React, { Component } from "react";
import { TextField, Card, CardContent, Button, Box, List, ListItem, ListItemSecondaryAction, IconButton, ListItemText, OutlinedInput, InputAdornment, AccordionSummary, Typography, AccordionDetails, Accordion } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number, condition: string, expressions: string[]) => void;
  deleteAllActiveBreakpoints: () => void;
}

interface CreateBreakpointFormState {
  fileName: string;
  lineNumber: number;
  condition: string;
  expressions: string[];
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
      expressions: []
    };
  }

  onFileName(fileName) {
    this.setState({ fileName });
  }

  onLineNumber(lineNumber) {
    this.setState({ lineNumber });
  }

  onCreateBreakpoint() {
    this.props.createBreakpoint(this.state.fileName, this.state.lineNumber, this.state.condition, this.state.expressions);
  }

  onDeleteAllActiveBreakpoints() {
    this.props.deleteAllActiveBreakpoints();
  }

  render() {
    const { fileName, lineNumber, condition, expressions } = this.state;
    return (
      <Box m={1}>
        <Card elevation={1}>
          <CardContent>
            <form>
              <TextField
                label="File Name"
                style={{ width: "100%" }}
                data-testid="fileName"
                value={fileName}
                onChange={(e) => this.onFileName(e.target.value)}
                variant="outlined"
                size="small"
              />
              <br />
              <br />
              <TextField
                label="Line Number"
                style={{ width: "100%" }}
                data-testid="lineNumber"
                value={lineNumber}
                onChange={(e) => this.onLineNumber(e.target.value)}
                variant="outlined"
                size="small"
              />
              <br/><br/>
              <ConditionAndExpressionsForm
                condition={condition}
                expressions={expressions}
                setCondition={condition => this.setState({condition})}
                setExpressions={expressions => this.setState({expressions})}
              />
              <br/><br/>
              <Button id='createBpButton'
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  this.onCreateBreakpoint();
                }}
              >
                Create Breakpoint
              </Button>
              <Button id='deleteActiveBpButton'
                onClick={(e) => {
                  e.preventDefault(); // Prevents a page reload from form submit.
                  this.onDeleteAllActiveBreakpoints();
                }}
              >
                Delete all active breakpoints
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

export const ConditionAndExpressionsForm = ({condition, expressions, setCondition, setExpressions}) => {
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
            onChange={e => setCondition(e.target.value)}
          />
          <ExpressionsList expressions={expressions} setExpressions={setExpressions}/>
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

export const ExpressionsList = ({expressions, setExpressions}) => {
  return (
    <List>
      {
        expressions.map((expression, index) => (
          <ExpressionView
            expression={expression}
            onChange={updatedExpression => {
              const updatedExpressions = [...expressions];
              updatedExpressions[index] = updatedExpression;
              setExpressions(updatedExpressions);
            }}
            onDelete={() => {
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