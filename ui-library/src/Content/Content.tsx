import type React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        //height: "35em",
        flexGrow: 1,
        justifyContent: "center",
    }
}))

const Content: React.FC<{height?: string}> = ({children, height}) => {
    const classes = useStyles();

    return (
        <div className={classes.main} style={height ? { height } : {}}>
            {children}
        </div>
    );
}

export default Content;