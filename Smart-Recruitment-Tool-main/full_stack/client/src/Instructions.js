import CloseIcon from "@mui/icons-material/Close";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function Instructions() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <HelpCenterIcon onClick={handleClickOpen}>Open dialog</HelpCenterIcon>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Instructions
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
          1. To begin querying simply type in your query into the textbox and click submit. you query can be anything regarding the dataset for eg. “How many candidates are from Pune?”
          </Typography>
          <Typography>
          2. If a table, pie chart, bar chart, or line chart would better suit the queries you have, kindly add the same in the query, for.eg. “Table the names, email and phone number of candidates from Bangalore”
          </Typography>
          <Typography>
          3. Your previous results will be displayed in the accordion boxes below the text box in the order of newest first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Understood
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
