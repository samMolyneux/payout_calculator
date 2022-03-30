import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  /* Styles applied to the root element. */
  root: {
    display: "flex",
    alignItems: "center",
    padding: "15px 0px 0px 0px",
    justifyContent: "flex-end",
    flex: "0 0 auto",
  },
  /* Styles applied to the root element if `disableSpacing={false}`. */
  spacing: {
    "& > :not(:first-child)": {
      marginLeft: 8,
    },
  },
}));

const PanelActions: React.FC<{disableSpacing?: boolean}> = React.forwardRef((props, ref: any) => {
  const { disableSpacing = false, ...other } = props;
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.spacing]: !disableSpacing,
      })}
      ref={ref}
      {...other}
    />
  );
});

export default PanelActions;