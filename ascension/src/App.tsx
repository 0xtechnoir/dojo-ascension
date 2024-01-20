import { useState } from "react";
import "./App.css";
import { useGameContext } from "./GameContext";
import Lobby from "./Lobby";

import GameBoardView from "./GameBoardView";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  const { playerInGameId } = useGameContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-space-bg">
      <div className="flex justify-center">
        {!showGameBoard ? (
          <Lobby
            setShowGameBoard={setShowGameBoard}
            currentGameID={playerInGameId}
          />
        ) : (
          <GameBoardView setShowGameBoard={setShowGameBoard} />
        )}
      </div>
    </div>
  );
}

export default App;
