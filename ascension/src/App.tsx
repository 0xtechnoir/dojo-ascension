import { useState } from "react";
import Lobby from "./components/Lobby";
import "./App.css";
import logo from './assets/dojo-mark-full-dark.png';


import GameBoardView from "./components/GameBoardView";

function App() {
  const [showGameBoard, setShowGameBoard] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-space-bg">
      <img src={logo} alt="Logo" className="absolute top-0 right-0 m-4 w-40 h-30 z-0" />
      <div className="flex justify-center z-10">
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
