import React from "react";
import ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import styled from "styled-components";

interface Step1TutorialProps {}

interface Step1TutorialState {}

const CloudLogo = styled.img`
  height: 50px;
  margin-top: 5px;
  margin-left: 5px;
`;

export class Step1Tutorial extends React.Component<
  Step1TutorialProps,
  Step1TutorialState
> {
  constructor(props: Step1TutorialProps) {
    super(props);
  }

  //  string ls =  chrome.tabs.create({url: 'http://Console.Cloud.Google.Com/debug'});

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
        <p> Trying this one : </p>

        <CloudLogo src={chrome.extension.getURL("../../assets/photo1.png")} />

        <p>Once signed-in you'll have your info hsowed in the small popup</p>

        <img
          src="https://drive.google.com/uc?export=view&id=1HU49kgHRJPse2NHMdfgmNhBNCfsiYz4O"
          width="50%"
          height="15%"
          border-radius="8px"
        />

        <p>After signing in a floating popup will show </p>

        <img
          src="https://drive.google.com/uc?export=view&id=1BbBRMUZWdO_yFOJRwz4SRUiM9bxqUMSa"
          width="50%"
          height="15%"
          border-radius="8px"
        />
      </section>
    );
  }
}
