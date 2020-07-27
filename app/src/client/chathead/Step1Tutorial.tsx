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
        
        <img src = "https://drive.google.com/uc?export=view&id=1jGUWeCwJeVCNU6lgr5KJQhTj9_bwVpes" width="90%" height="70%" />

        {/* <video width="90%" height="70%" autoPlay loop>
          <source  src = "https://drive.google.com/uc?export=view&id=1yIK0b40GR564KSZXjDm5EtF3r0DANH19" type="video/webm"></source>
        </video> */}

      </section>
    );
  }
}
