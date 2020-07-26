import React from "react";
import ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import styled from "styled-components";

interface Step1TutorialProps {}

interface Step1TutorialState {}
export class Step1Tutorial extends React.Component<
  Step1TutorialProps,
  Step1TutorialState
> {
  constructor(props: Step1TutorialProps) {
    super(props);
  }

  render() {
    return (
      <section>
        <p>Sign-in through the extension popup after installing it</p>
        <img src="../../../../images/cc.png" width="50px" height="50px" />

      </section>
    );
  }
}
