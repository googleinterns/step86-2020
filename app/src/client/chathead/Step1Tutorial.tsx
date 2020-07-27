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
        <p>Sign-in through the extension popup after installing it from the Chrome Web-store</p>
        
        <img src = "https://drive.google.com/uc?export=view&id=1xlm5As8pkekhcRLHyuOtD73KH-NgBYyn" width="50%" height="40%" border-radius = "8px"/>


        <img src = "https://drive.google.com/uc?export=view&id=1a1UZ6OIHuxzOT29XuQph94y6DQTdVmBf" width="50%" height="15%" border-radius = "8px" />

        <p>After signing in a floating popup will show </p>
        

      </section>
    );
  }
}
