import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { 
  Button, 
  Content, 
  PageHeader, 
  Root, 
  Text, 
  TextField
} from "../../ui-library/src";
const RandExp = require('randexp');

const Home = () => {
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleTextFieldClick = (e: React.MouseEvent<HTMLInputElement>):void => {
    e.stopPropagation();
  }

  const onGameCodeChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setGameCode(e.currentTarget.value);
  }

  const handleNewGameClick = ():void => {
    console.log("New home game");
    let newCode = new RandExp('^[A-Z]{2}[0-9]{4}$').gen();
    navigate(`/game/${newCode}`);
  }

  const handleGameCodeClick = ():void => {
    if (gameCode === "") {
      console.log("No game code entered");
    } else {
      navigate(`/game/${gameCode}`)
    }
  }

  return (
    <Root>
      <PageHeader onClick={() => navigate("/")}>
        <Text bold mediumHeader>CASH: All in</Text>
      </PageHeader>
      <Content height="35em">
        <Button onClick={handleNewGameClick} large green>
          <Text bold>New Home Game</Text>
        </Button>

        <br />

        <Button onClick={handleGameCodeClick} large green>
          <Text bold>Join with Code</Text>
          <TextField 
            style = {{ marginLeft: "10px"}}
            value={gameCode} 
            onClick={handleTextFieldClick}
            onChange={onGameCodeChange} 
          />
        </Button>
      </Content>
    </Root>
  );
}

export default Home;