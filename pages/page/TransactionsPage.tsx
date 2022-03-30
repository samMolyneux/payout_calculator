import type React from "react"
import { useLocation, useNavigate, useParams, } from "react-router-dom"
import {
    Button,
    Content,
    PageHeader,
    Panel,
    PanelRow,
    Root,
    Text
} from "../../ui-library/src";

interface Transaction {
    from: string;
    to: string;
    val: number;
}

const TransactionsPage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    let location = useLocation();
    const { state } = location;
    const transactions = state as Transaction[];

    return (
        <Root>
            <PageHeader onClick={() => navigate("/")}>
                <Text bold mediumHeader>CASH: All in</Text>
            </PageHeader>
            <Content>
                <div 
                    style={{ 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#35654d", 
                        marginRight: "20px", 
                        width: "50%", 
                        height: "4em", 
                        borderRadius: "5px",
                        margin: "10px"
                    }}
                >
                    <Text bold mediumHeader>Game code: {gameId}</Text>
                </div>

                <Panel>
                    <PanelRow>
                        <Text bold>Name</Text>
                        <Text bold>Transfer to</Text>
                        <Text bold>Amount</Text>
                    </PanelRow>

                    {transactions.map((transaction, index) => {
                        return (
                            <PanelRow key={index}>
                                <Text>{transaction.from}</Text>
                                <Text>{transaction.to}</Text>
                                <Text>{transaction.val}</Text>
                            </PanelRow>
                        )
                    })}
                </Panel>
                <br />

                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "30%"}}>
                    <Button green onClick={() => console.log("dowload pdf")}>
                        <Text>Download</Text>
                    </Button>
                    <Button green onClick={() => navigate("/")}>
                        <Text>Home</Text>
                    </Button>
                </div>
            </Content>
        </Root>
    )
}

export default TransactionsPage;