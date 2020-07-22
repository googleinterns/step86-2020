import React from "react";
import { TextField, Card, CardContent, Button, Box, List, ListItem, ListItemSecondaryAction, IconButton, ListItemText, OutlinedInput, InputAdornment, AccordionSummary, Typography, AccordionDetails, Accordion } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

interface CreateBreakpointFormProps {
  createBreakpoint: (fileName: string, lineNumber: number) => void;
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
    this.props.createBreakpoint(this.state.fileName, this.state.lineNumber);
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
                style={{width: "100%"}}
                data-testid="fileName"
                value={fileName}
                onChange={(e) => this.onFileName(e.target.value)}
                variant="outlined"
              />
              <br/><br/>
              <TextField
                label="Line Number"
                style={{width: "100%"}}
                data-testid="lineNumber"
                value={lineNumber}
                onChange={(e) => this.onLineNumber(e.target.value)}
                variant="outlined"
              />
              <br/><br/>
              <ConditionAndExpressionsForm
                condition={condition}
                expressions={expressions}
                setCondition={condition => this.setState({condition})}
                setExpressions={expressions => this.setState({expressions})}
              />
              <br/><br/>
              <Button onClick={(e) => {
                e.preventDefault(); // Prevents a page reload from form submit.
                this.onCreateBreakpoint();
                }}>
                Create Breakpoint
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>      
    );
  }
}

const ConditionAndExpressionsForm = ({condition, expressions, setCondition, setExpressions}) => {
  return (
    <Accordion>
      <AccordionSummary>
        <Typography variant="body2">Condition and Expressions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          <TextField
            label="Condition"
            size="small"
            style={{width: "100%"}}
            variant="outlined"
            value={condition}
            onChange={e => setCondition(e.target.value)}
          />
          <List>
            {
              expressions.map((expression, index) => (
                <ListItem>
                  <TextField
                    size="small"
                    label={`Expression ${index + 1}`}
                    variant="outlined"
                    value={expression}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => {
                            const updatedExpressions = [...expressions];
                            updatedExpressions.splice(index, 1);
                            setExpressions(updatedExpressions);
                          }}>
                            <DeleteIcon/>
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </ListItem>
              ))
            }
            <Button size="small" onClick={() => setExpressions([...expressions, ""])}>Add Expression</Button>
          </List>
        </List>
      </AccordionDetails>
    </Accordion>
  )
}