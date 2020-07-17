import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { AuthPopup } from "../popup/AuthPopup";
import Paper from "@material-ui/core/Paper";

const Wrapper = styled(Paper)`
  width: 300px;
`;
interface PopupFormProps {}

interface PopupFormState {}
export class Popup extends React.Component<PopupFormProps, PopupFormState> {
  constructor(props: PopupFormProps) {
    super(props);
  }

  render() {
    return <Wrapper>{<AuthPopup />}</Wrapper>;
  }
}

// Mounts popup once html is loaded
document.addEventListener(
  "DOMContentLoaded",
  () => {
    const appMount = document.querySelector("#app");
    ReactDOM.render(<Popup />, appMount);
  },
  false
);
