import type React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        width: "100%",
        height: "3em",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#972a27",
    }
}));

const PageHeader: React.FC<{onClick?: ()=>void}> = ({onClick, children}) => {
    const classes = useStyles();

    return (
        <div className={classes.main} onClick={onClick}>
            {children}
        </div>
    )
};

export default PageHeader;