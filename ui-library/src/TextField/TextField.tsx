import React from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import { InputBase } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  wrapper: {
    fontFamily: "Open sans",
    boxSizing: "border-box",
    border: `1px solid #000000`,
    background: "#FFFFFF",
    height: 32,
    borderRadius: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 280,
  },
  multilineWrapper: {
    fontFamily: "Open sans",
    boxSizing: "border-box",
    border: `1px solid #000000`,
    background: "#FFFFFF",
    minHeight: 32,
    borderRadius: 2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 280,
  },
  root: {
    padding: "0px 8px",
    fontSize: 14,
    height: 32,
    flexGrow: 1,
  },
  small: {
    width: 150,
  }
}));

const TextField: React.FC<{
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    small?: boolean,
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
    wrapperRef?: any,
    multiline?: boolean,
    number?: boolean,
    style?: React.CSSProperties,
}> = React.forwardRef(({value, onChange, small, disabled, onClick, wrapperRef, multiline, style, number}, ref: any) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.wrapper, {
        [classes.multilineWrapper]: multiline,
        [classes.small]: small,
      })}
      ref={wrapperRef}
      style={style ? style: {}}
      onClick={onClick}
    >
      <InputBase
        value={value}
        onChange={onChange}
        type={number ? "number" : "text"}
        classes={{ root: classes.root }}
        disabled={disabled}
        ref={ref}
        multiline={multiline}
      />
    </div>
  );
})

export default TextField;
