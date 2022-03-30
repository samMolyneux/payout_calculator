import type React from "react";
import { makeStyles, Dialog as MuiDialog } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles({
  dialogPaper: {
    width: "40%",
    border: "1px solid #E3E9EF",
    height: "auto",
    borderRadius: 10,
    padding: "20px",
    borderStyle: "none",
    backgroundColor: "#4b5563"
  },
});

const PanelDialog: React.FC<{ 
    open: boolean,
    onClose: any,
    width?: string,
    minWidth?: string
}> = ({ open, onClose, children, width, minWidth }) => {
  const classes = useStyles();

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      classes={{
        paper: classes.dialogPaper,
      }}
      PaperProps={{
        style: { width, minWidth },
      }}
      maxWidth={false}
    >
      {children}
    </MuiDialog>
  );
}

export default PanelDialog;