import { useState } from "react";
import Lobby from "./components/Lobby";
import "./App.css";

import GameBoardView from "./components/GameBoardView";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-space-bg">
      <div className="flex justify-center">
        {!showGameBoard ? (
          <Lobby
            setShowGameBoard={setShowGameBoard}
          />
        ) : (
          <GameBoardView setShowGameBoard={setShowGameBoard} />
        )}
      </div>
    </div>
  );
}

export default App;
