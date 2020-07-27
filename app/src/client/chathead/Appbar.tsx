import React, { ReactChildren } from "react";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import PhotoSizeSelectSmallIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import { Toolbar, Typography, IconButton, AppBar, Box } from "@material-ui/core";
import { WindowSizeContext, WindowSize } from "./windowSizeContext";

interface AppBarProps {
  /** Displayed text for the appbar */
  title: string;
  /** An optional function to handle 'go back' action. If defined, a back button will be shown. */
  onBack: () => void;
  /** Optional nodes to add between title and resize buttons. */
  children?: ReactChildren;
}

/** A unified header for all pages within the chathead. */
export const Appbar = ({title, onBack, children = null}: AppBarProps) => (
  <AppBar position="static">
    <Toolbar>
      {
        onBack && (
          <IconButton edge="start" color="inherit" onClick={onBack}>
            <ArrowBackIcon/>
          </IconButton>
        )
      }
      <Typography variant="h6">{title}</Typography>
      <Box flexGrow={1}/>
      {children}
      <WindowSizeContext.Consumer>
        {({size, setSize}) => (
          <>
            <IconButton color="inherit" onClick={() => setSize(WindowSize.COLLAPSED)}>
              <PhotoSizeSelectSmallIcon/>
            </IconButton>
            {
              size !== WindowSize.FULL_SCREEN ?
                <IconButton color="inherit" onClick={() => setSize(WindowSize.FULL_SCREEN)}>
                  <SettingsOverscanIcon/>
                </IconButton>
                :
                <IconButton color="inherit" onClick={() => setSize(WindowSize.REGULAR)}>
                  <PictureInPictureIcon/>
              </IconButton>
            }
          </>
        )}
      </WindowSizeContext.Consumer>
    </Toolbar>
  </AppBar>
)