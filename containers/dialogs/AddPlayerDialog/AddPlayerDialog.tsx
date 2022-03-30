import type React from "react"
import { useState } from "react"
import {
    Button,
    PanelActions,
    PanelDialog,
    PanelHeading,
    PanelRow,
    Text,
    TextField
} from "../../../ui-library/src";

interface Player {
    name: string;
    in: number;
    out: number;
    net: number;
}

const AddPlayerDialog: React.FC<{
    open: boolean, 
    onClose: () => void,
    width?: string,
    minWidth?: string,
    ledger: any,
    setLedger: (ledger: Array<Player>) => void,
}> = ({open, onClose, width, minWidth, ledger, setLedger, children}) => {
    const [playerName, setPlayerName] = useState("");
    const [inAmount, setInAmount] = useState("0");
    const [out, setOut] = useState("0");

    const onSavePlayer = ():void => {
        let net = parseInt(out) - parseInt(inAmount);
        ledger.push({ name: playerName, in: parseInt(inAmount), out: parseInt(out), net: net});
        setLedger(ledger);
        handleClose();
    }

    const handleClose = ():void => {
        setPlayerName("");
        setInAmount("0");
        setOut("0");
        onClose();
    }

    return (
        <PanelDialog 
            open={open}
            onClose={onClose}
            width={width}
            minWidth={minWidth}
        >
            <PanelHeading>Add player</PanelHeading>
            <PanelRow>
                <Text>Name</Text>
                <TextField
                    value={playerName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.currentTarget.value)}
                />
            </PanelRow>
            <br />
            <PanelRow>
                <Text>In amount*</Text>
                <TextField
                    number
                    value={inAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInAmount(e.currentTarget.value)}
                />
            </PanelRow>
            <br />
            <PanelRow>
                <Text>Out amount*</Text>
                <TextField
                    number
                    value={out}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOut(e.currentTarget.value)}
                />
            </PanelRow>
            <PanelActions>
                <Button small red onClick={handleClose}>
                    <Text>Cancel</Text>
                </Button>
                <Button small green onClick={onSavePlayer}>
                    <Text>Add player</Text>
                </Button>
            </PanelActions>
        </PanelDialog>
    )
}

export default AddPlayerDialog;