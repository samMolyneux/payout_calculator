import type React from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    main: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        height: "20px",
        margin: "5px"
    }
}));

const PanelRow: React.FC<{}> = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.main}>
            {children}
        </div>
    )
}

export default PanelRow;