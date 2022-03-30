import type React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgb(55 65 81 / var(--tw-bg-opacity))",
        borderRadius: "5px",
        width: "80%",
        padding: "2px"
    }
}));

const Panel: React.FC<{}> = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.main}>
            {children}
        </div>
    );
}

export default Panel;