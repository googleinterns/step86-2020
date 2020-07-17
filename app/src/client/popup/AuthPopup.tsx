import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@material-ui/core";
import GoogleButton from 'react-google-button';
import { AuthenticationRequest, GetAuthStateRequest, AuthenticationRequestData, GetAuthStateRequestData } from "../../common/requests/BackgroundRequest";


interface AuthPopupFormProps {
}

interface AuthPopupFormState {
}
export class AuthPopup extends React.Component<AuthPopupFormProps, AuthPopupFormState> {
  constructor(props: AuthPopupFormProps) {
    super(props);
  }

  render() {

    const getAuthState = async () => {
      const response = await new GetAuthStateRequest().run(new GetAuthStateRequestData());
      if (response.isAuthenticated) {
        chrome.tabs.executeScript({
          file: 'Chathead.tsx'
        });
      }
    }

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Cloud Debugger</Typography>
          </Toolbar>
        </AppBar>
        <Box style={{ paddingTop: '30px', paddingRight: '40px' }} >
          <GoogleButton onClick={async () => {
            const response = await new AuthenticationRequest().run(new AuthenticationRequestData());
            alert(response);
            return response;
          }} />
        </Box>
      </>
    );
  }
}

