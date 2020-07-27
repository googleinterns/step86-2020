import React from "react";
import ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import styled from "styled-components";

interface Step2TutorialProps {}

interface Step2TutorialState {}
export class Step2Tutorial extends React.Component<
  Step2TutorialProps,
  Step2TutorialState
> {
  constructor(props: Step2TutorialProps) {
    super(props);
  }

  render() {
    return (
      <section>
        <p>
          {" "}
          After slecting a project and a debugee enter the line number and file
          name to set a breakpoint manually or you can set it on the line
        </p>

        <img
          src="https://drive.google.com/uc?export=view&id=1rao3qTyVzV150Db7TGo0OQya-SKrl8ed"
          width="50%"
          height="40%"
          border-radius="8px"
        />
        <p>
          {" "}
          After the breakpoint is hit you'll recive a stack trace similair to
          the picture below
        </p>
        <img
          src="https://drive.google.com/uc?export=view&id=1ETtG6pP3l29LqSy0lI5ixyxg8OI2YYi_"
          width="50%"
          height="40%"
          border-radius="8px"
        />
        <p>
          {" "}
          Afterwards, you can delete a single breakpoint as well as deleting all
          the active breakpoints
        </p>
      </section>
    );
  }
}
