import React from "react";

import RefreshIcon from '@material-ui/icons/Refresh';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import PhotoSizeSelectSmallIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import { Toolbar, Typography, IconButton, AppBar, Box } from "@material-ui/core";
import { WindowSizeContext, WindowSize } from "./windowSizeContext";

/** A unified header for all pages within the chathead. */
export const Appbar = ({title, onRefresh}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">{title}</Typography>
      <Box flexGrow={1}/>
      {onRefresh && (
          <IconButton color="inherit" onClick={onRefresh}>
            <RefreshIcon/>
          </IconButton>
        )
      }
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