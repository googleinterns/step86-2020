import React from "react";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { AppBar, Toolbar, Typography, Box } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import Image from "material-ui-image";

const Wrapper = styled(Paper)`
  width: 300px;
`;

/**
 * This class is reponsible for Walkthrought dialog popup
 */
export default function ScrollDialog() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={handleClickOpen("paper")}>
            <Typography variant="h6">Check Walkthrough</Typography>
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Walkthrough</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <h1> What's Google Cloud Debugger Extension for ? </h1>

            <div>
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </div>
            <div>
              <strong> How to use this Extension </strong>
              Go to github and refresh your page something like this
            </div>
            <Image src="http://loremflickr.com/300/200"/>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
