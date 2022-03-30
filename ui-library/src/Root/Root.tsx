import type React from "react"

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
    }
});

const Root: React.FC<{}> = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {children}
        </div>
    );
}

export default Root;