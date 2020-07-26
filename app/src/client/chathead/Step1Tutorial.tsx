import React from "react";
import ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import styled from "styled-components";


interface TutorialIntroFormProps {}

interface TutorialIntroFormState {}
export class TutorialIntro extends React.Component<
  TutorialIntroFormProps,
  TutorialIntroFormState
> {
  constructor(props: TutorialIntroFormProps) {
    super(props);
  }

  render() {
    return (
      <section>
        <p>Sign-in through the extension popup after installing it</p>
        <Image
          src="../../../../images/cc.png"
          width="50px"
          height="50px"
        />

        <Image
          src="https://drive.google.com/uc?export=view&id=1mX7pieRulh6AtFvnH6zvIKZol_KxpbhP"
          width="50px"
          height="50px"
        />
      </section>
    );
  }
}
