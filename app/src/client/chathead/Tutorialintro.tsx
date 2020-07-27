import React from "react";
import {
  Link,
} from "@material-ui/core";

interface TutorialIntroFormProps {}
interface TutorialIntroFormState {}

/**
 * This class is responsible of  tutorial's first content which is the 'about this extension'
 */
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
