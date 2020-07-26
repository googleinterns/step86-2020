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
import Demo from './TutorialHelper';

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
            {/* <section>
              <h2> What's the Cloud Debugger Extension for </h2>
              <p>
                The Extension is a simplified version to access the GCP Cloud
                Debugger in order for customers to view their GCP projects and
                associated debuggees.
              </p>
            </section>

            <section>
              <h2> How to use it </h2>
              <p>Sign-in through the extension popup after installing it</p>

              <Image
                src="https://drive.google.com/uc?export=view&id=1mX7pieRulh6AtFvnH6zvIKZol_KxpbhP"
                width="100px"
                height="100px"
              />

              <p>
                After signing-in the extension will popup as the folowing
                picture shows
              </p>

              <Image
                src="https://drive.google.com/uc?export=view&id=1GC5ysuuCsOanOqLQqkiOnsmx4I281Qnw"
                width="100px"
                height="100px"
              />

              <p>
                <Box fontWeight="fontWeightBold" m={1}>
                  {" "}
                  Note{" "}
                </Box>{" "}
                refreshing the page each time is important.
              </p>
            </section> */}
            {
              <Demo/>
            }
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
