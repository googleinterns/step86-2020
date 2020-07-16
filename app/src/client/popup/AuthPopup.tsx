import React from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, Box} from "@material-ui/core";
import GoogleButton from 'react-google-button';

interface AuthPopupFormProps {
}

interface AuthPopupFormState {
}
export class AuthPopup extends React.Component<AuthPopupFormProps,AuthPopupFormState> {
  constructor(props: AuthPopupFormProps){
    super(props);
  }
  
  render() {
    return (
    <>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6">Cloud Debugger</Typography> 
        </Toolbar>
      </AppBar>
      <Box style={{paddingTop:'30px', paddingRight:'40px'}} >
        <GoogleButton onClick={() => { alert("hello world") }}/> 
     </Box>
    </>
    );
  }
}

