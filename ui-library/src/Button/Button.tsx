import type React from "react"
import clsx from "clsx"
import MuiButton from "@material-ui/core/ButtonBase";
import { makeStyles, withMobileDialog } from "@material-ui/core"
import { Text } from "../index";

const useStyles = makeStyles(() => ({
    button: {
        boxSizing: "border-box", //keep this
        borderRadius: 5,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 16px", //medium
        fontWeight: "bold",
        fontSize: 15,
        lineHeight: "19px",
        position: "relative",
        marginBottom: "10px",
    },
    small: {
        width: "30%",
    },
    large: {
        width: "40%",
        height: "20%",
    },
    wide: {
        width: "50%",
        height: "4em",
    },
    green: {
        backgroundColor: "#35654d",
        border: "2px solid #FFFFFF",
    },
    red: {
        backgroundColor: "#972a27",
        border: "2px solid #000000",
    }
}));

const Button: React.FC<{
    onClick: () => void,
    disabled?: boolean,
    small?: boolean,
    large?: boolean,
    wide?: boolean,
    green?: boolean,
    red?: boolean
}> = ({onClick, children, disabled, small, large, wide, green, red, ...rest}) => {
    const classes = useStyles();

    return (
        <MuiButton 
            disabled={disabled}
            onClick={() => onClick()}
            className={clsx(classes.button, {
                [classes.small]: small,
                [classes.large]: large,
                [classes.wide]: wide,
                [classes.green]: green,
                [classes.red]: red,
            })}
            {...rest}
        >
            {children}
        </MuiButton>
    );
}

export default Button;