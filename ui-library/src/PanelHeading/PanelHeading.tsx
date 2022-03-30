import React from "react";
import { Text } from "../";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "0px 0px 15px 0px",
    fontSize: 20,
  },
}));

const PanelHeading: React.FC<{}> = ({ children, ...rest }) => {
  const classes = useStyles();

  return (
    <div {...rest} className={classes.wrapper}>
      <Text normalHeader bold>
        {children}
      </Text>
    </div>
  );
}

export default PanelHeading;