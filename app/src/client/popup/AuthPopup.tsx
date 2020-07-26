import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@material-ui/core";
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
              <Typography
                style={{
                  textAlign: "center",
                  margin: "auto",
                }}
                variant="h6"
              >
                Welcome to Cloud Debugger
              </Typography>
            </Toolbar>
          </AppBar>
          <Avatar
            alt="Remy Sharp"
            style={{
              display: "block",
              width: "40%",
              height: "40%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "30px",
              marginBottom: "10px",
              border: "1px solid #DCDCDC",
            }}
            src="https://authenticgoods.co/wrapbootstrap/themes/sparks/img/team/avatar-male.png"
          />
          <Typography
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "20px;",
            }}
            variant="h6"
          >
            YOUR NAME
          </Typography>

          <Typography
            style={{
              textAlign: "center",
              paddingBottom: "50px",
              fontSize: "14px;",
            }}
          >
            example123@google.com
          </Typography>
        </>
      );
    }
  }
}
