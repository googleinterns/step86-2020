import React from "react";
import ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import styled from "styled-components";
import {
  Typography,
  Link,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";

interface TutorialIntroFormProps {}

interface TutorialIntroFormState {}
export class TutorialIntro extends React.Component<
  TutorialIntroFormProps,
  TutorialIntroFormState
> {
  constructor(props: TutorialIntroFormProps) {
    super(props);
  }

  preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

  render() {
    return (
      <section>
        The Extension is a simplified version to access the GCP Cloud Debugger
        in order for customers to view their GCP projects and associated
        debuggees. See this
        <Link
          href="https://cloud.google.com/debugger/docs"
          onClick={this.preventDefault}
        >
          document
        </Link>{" "}
        to know more about Google Cloud Debugger
      </section>
    );
  }
}
