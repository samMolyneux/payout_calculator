import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Content, PageHeader, Panel, PanelRow, Root, Text, TextField } from "../../ui-library/src"
import { AddPlayerDialog } from ".."

export default function GamePage() {
    const { gameId } = useParams(); 
    const navigate = useNavigate();

    return (
        <Root>
            <PageHeader onClick={() => navigate("/")}>
                <Text bold mediumHeader>CASH: All in</Text>
            </PageHeader>
            <Content>
                <div 
                    style={{ 
                        display: "flex", 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        width: "50%", 
                        marginTop: "10px" 
                    }}
                >
                    <div 
                        style={{ 
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#35654d", 
                            marginRight: "20px", 
                            width: "50%", 
                            height: "4em", 
                            borderRadius: "5px" 
                        }}
                    >
                        <Text bold mediumHeader>Game code: {gameId}</Text>
                    </div>
                    <br />
                    <Button wide green onClick={() => console.log("Game link copied")}>
                        <Text bold mediumHeader>Copy game link</Text>
                    </Button>
                </div>

                <InputForm />
            </Content>
        </Root>
    )
}

interface Player {
    name: string;
    in: number;
    out: number;
    net: number;
}

interface Transaction {
    from: string;
    to: string;
    val: number;
}

const InputForm: React.FC<{}> = (props) => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
    const [ledger, setLedger] = useState<Array<Player>>([]);

    let transactions: Transaction[] = new Array();

    function calculate(players: Player[]) {
        console.log({players});
        let sum = 0;
        let positives: Player[] = new Array();
        let negatives: Player[] = new Array();

        for (let player of players) {
            sum += player.net;
            if (player.net > 0) {
                positives.push(player);
            } else if (player.net < 0) {
                negatives.push(player);
            } else {
                console.log("evens");
            }
        }

        if (sum != 0) {
            console.log("INVALID INPUT: entries do not sum to zero\n actual sum:  ", sum);
        return; 
        }

        positives.forEach((pos) => {
            for (let neg of negatives) {
                if (pos.net + neg.net === 0) {
                    transactions.push({from: pos.name, to: neg.name, val: pos.net});
                    positives.splice(positives.indexOf(pos), 1);
                    negatives.splice(negatives.indexOf(neg), 1);
                    break;
                }
            }
        });

        while (negatives.length != 0) {
            positives = positives.sort((a, b) => b.net - a.net);
            console.log(positives);
            positives.forEach((curr) => {
            
                let source = negatives.sort((a, b) => a.net - b.net)[0];

                let sourceVal = Math.abs(source.net);
                let destVal = curr.net;
                let transactionVal = Math.min(sourceVal, destVal);
                if(sourceVal == destVal){
                
                    positives = positives.filter((player) => player !== curr);
                    negatives = negatives.filter((player) => player !== source);
                
                }else if (sourceVal > destVal){
                    positives = positives.filter((player) => player !== curr);
                    source.net = source.net + transactionVal;
                }else{
                    negatives = negatives.filter((player) => player !== source);
                    curr.net = curr.net - transactionVal;
                }

                transactions.push({from: source.name, to: curr.name, val: transactionVal});
                console.log("Transactions: ", transactions, "\n positives: ", positives, "\n negatives: ", negatives);
            });

        }
        

        console.log("Transactions: ", transactions);
    }

    const handleCalculateClick = ():void => {
        ledger.forEach(player => player.net = player.out-player.in);
        setLedger(ledger);
        calculate(ledger); 
        navigate(`/transactions/game/${gameId}/`, {state: transactions});
        transactions = new Array();
    }

    return (
        <>
            <Panel>
                <PanelRow>
                    <Text>Name</Text>
                    <Text>In</Text>
                    <Text>Out</Text>
                    <Text>Net</Text>
                </PanelRow>

                {/* A player element */}

                {ledger.map((player, index) => {
                    return (
                        <>
                            <InputRow
                                key={index}
                                playerName={player.name} 
                                inAmount={player.in}
                                outAmount={player.out}
                                ledger={ledger}
                                setLedger={setLedger}
                            />
                            <br />
                        </>
                    )
                })}
                <Button onClick={() => setAddPlayerDialogOpen(true)}>Add player</Button>
            </Panel>
            
            <br />

            <Button wide green onClick={handleCalculateClick}>
                <Text bold>Calculate</Text>
            </Button>

            <AddPlayerDialog 
                open={addPlayerDialogOpen} 
                onClose={() => setAddPlayerDialogOpen(false)} 
                ledger={ledger}
                setLedger={setLedger}
            />
        </>
    );
};

const InputRow: React.FC<{
    playerName: string;
    inAmount: number;
    outAmount: number;
    ledger: Player[];
    setLedger: (ledger: Player[]) => void;
}> = ({playerName, inAmount, outAmount, ledger, setLedger, children}) => {
    const [inVal, setInVal] = useState(inAmount);
    const [outVal, setOutVal] = useState(outAmount);

    const updateIn = (e: React.ChangeEvent<HTMLInputElement>):void => {
        setInVal(e.target.valueAsNumber);
        console.log(e.target.valueAsNumber);
        ledger.forEach(player => {
            if (player.name === playerName) {
                player.in = e.target.valueAsNumber;
            }
        });
        setLedger(ledger);
    }

    const updateOut = (e: React.ChangeEvent<HTMLInputElement>):void => {
        setOutVal(e.target.valueAsNumber);
        ledger.forEach(player => {
            if (player.name === playerName) {
                player.out = e.target.valueAsNumber;
            }
        });
        setLedger(ledger);
    }

    return (
        <PanelRow>
            <Text bold>{playerName}</Text>
            <TextField
                number
                small
                value={String(inVal)}
                onChange={updateIn}
            />
            <TextField
                number
                small
                value={String(outVal)}
                onChange={updateOut}
            />

            <TextField 
                number
                small
                value={String(outVal-inVal)}
                onChange={()=>{}}
                disabled
            />
        </PanelRow>
    );
};