import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Images = styled.img`
  width: 50%;
  height: 15%;
  margin-left: 90px;
  border-radius: 8px;
`;

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
        <p>
          Sign-in through the extension popup after installing it from the
          Chrome Web-store
        </p>

        <img
          src="https://drive.google.com/uc?export=view&id=13qzP8vr_o0ZMPIbBXe6niSnJYFKF4yS7"
          width="50%"
          height="40%"
          border-radius="8px"
        />


        <p>Once signed-in you'll have your info showed in the small popup</p>

        <Images src="https://drive.google.com/uc?export=view&id=1HU49kgHRJPse2NHMdfgmNhBNCfsiYz4O" />

        <p>After signing in a floating popup will show </p>

        <Images src="https://drive.google.com/uc?export=view&id=1BbBRMUZWdO_yFOJRwz4SRUiM9bxqUMSa" />
      </section>
    );
  }
}
