import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@material-ui/core";
import GoogleButton from "react-google-button";
import {
  AuthenticationRequest,
  GetAuthStateRequest,
  AuthenticationRequestData,
  GetAuthStateRequestData,
} from "../../common/requests/BackgroundRequest";

interface AuthPopupFormProps {}

interface AuthPopupFormState {
  isAuthenticated: boolean;
}
export class AuthPopup extends React.Component<
  AuthPopupFormProps,
  AuthPopupFormState
> {
  constructor(props: AuthPopupFormProps) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  async getAuthState() {
    const response = await new GetAuthStateRequest().run(
      new GetAuthStateRequestData()
    );
    this.setState({ isAuthenticated: response.isAuthenticated });
    chrome.tabs.executeScript({
      file: "injected-app.tsx",
    });
  }

  render() {
    if (this.state.isAuthenticated == false) {
      return (
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Cloud Debugger</Typography>
            </Toolbar>
          </AppBar>
          <Box
            style={{
              paddingTop: "30px",
              paddingLeft: "30px",
              paddingBottom: "30px",
            }}
          >
            <GoogleButton
              onClick={async () => {
                await new AuthenticationRequest().run(
                  new AuthenticationRequestData()
                );
                this.getAuthState();
              }}
            />
          </Box>
        </>
      );
    } else {
      chrome.tabs.executeScript({
        file: "injected-app.tsx",
      });
      return;
    }
  }
}
