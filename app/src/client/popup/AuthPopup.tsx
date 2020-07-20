import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@material-ui/core";
import GoogleButton from "react-google-button";
import CheckIcon from "@material-ui/icons/Check";
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

/**
 *  This class is responsible of authenticating users in the small popup
 */
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

  /**
   *  get authentication state by making a call to backend requests
   */
  async getAuthState() {
    const response = await new GetAuthStateRequest().run(
      new GetAuthStateRequestData()
    );
    this.setState({ isAuthenticated: response.isAuthenticated });
  }

  componentDidMount() {
    this.getAuthState();
  }

  render() {
    if (!this.state.isAuthenticated) {
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
                <h1>Hello world</h1>;
              }}
            />
          </Box>
        </>
      );
    }
    if (this.state.isAuthenticated) {
      return (
        <>
          <AppBar position="static">
            <Toolbar>
              <CheckIcon></CheckIcon>{" "}
              <Typography
                variant="h6"
                style={{
                  paddingLeft: "30px",
                }}
              >
                You are signed in
              </Typography>{" "}
            </Toolbar>
          </AppBar>
        </>
      );
    }
  }
}
