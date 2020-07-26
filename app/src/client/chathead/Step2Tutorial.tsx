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
        <p>Step 2 hello world :)))))))))))</p>
      </section>
    );
  }
}
