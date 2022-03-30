import type React from "react"
import clsx from "clsx";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    main: {
        fontStyle: "normal",
        fontSize: "16px",
        margin: 0,
        padding: 0,
        wordBreak: "break-word"
    },
    bold: {
        fontWeight: 700
    },
    normalHeader: {
        fontSize: "20px",
    },
    mediumHeader: {
        fontSize: "24px",
    },
    largeHeader: {
        fontSize: "32px",
    },
}))

const Text: React.FC<{
    bold?: boolean, 
    normalHeader?: boolean, 
    mediumHeader?: boolean, 
    largeHeader?: boolean
}> = ({children, bold, normalHeader, mediumHeader, largeHeader}) => {
    const classes = useStyles();

    return (
        <p 
            className={clsx(classes.main, {
                [classes.bold]: bold,
                [classes.normalHeader]: normalHeader,
                [classes.mediumHeader]: mediumHeader,
                [classes.largeHeader]: largeHeader
            })}
        >
            {children}
        </p>
    )
}

export default Text;