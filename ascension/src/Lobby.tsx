import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { useEntityQuery } from "@dojoengine/react";
import { getComponentValue, Has } from "@dojoengine/recs";
// import { useMUD } from "./MUDContext";
import { useDojo } from "./DojoContext";

interface LobbyProps {
  setShowGameBoard: React.Dispatch<React.SetStateAction<boolean>>;
  showGameBoard: boolean;
  currentGameID: bigint | undefined;
}

const Lobby: React.FC<LobbyProps> = ({ setShowGameBoard, currentGameID }) => {
  const { setGameId, displayMessage } = useGameContext();
  
  // const {
  //   components: { GameSession },
  // } = useMUD();

  const {
    setup: {
        components: { GameSession },
    },
  } = useDojo();

  const [inputGameID, setInputGameID] = useState<bigint | null>(null);

  const allGameSessions = useEntityQuery([Has(GameSession)]);
  const allGameIds = allGameSessions.map((entity) => {
    const rec = getComponentValue(GameSession, entity);
    return rec?.gameId;
  });

  const handleCreateGame = () => {
    // generate a unique 9-digit gameId
    let gameId: bigint;
    while (true) {
      gameId = BigInt(Math.floor(100000000 + Math.random() * 900000000));
      if (!allGameIds.includes(gameId)) {
        break;
      }
    }
    setGameId(gameId);
    setShowGameBoard(true);
  };
  const handleJoinGame = (
    eventOrGameID?: React.MouseEvent<HTMLButtonElement, MouseEvent> | bigint
  ) => {
    let gameIDToJoin: bigint | null;
    if (typeof eventOrGameID === "bigint") {
      gameIDToJoin = BigInt(eventOrGameID);
    } else {
      gameIDToJoin = inputGameID ? BigInt(inputGameID) : null;
    }

    if (gameIDToJoin) {
      setGameId(gameIDToJoin);
      setShowGameBoard(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded shadow-md w-120 text-white bg-slate-900 border border-gray-500">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ascension</h1>
        {currentGameID ? (
          <>
            <p>{`You are already in game: ${currentGameID}`}</p>
            <br />
            <button
              className="btn-sci-fi"
              onClick={() => handleJoinGame(currentGameID)}
            >
              Join This Game
            </button>
          </>
        ) : (
          <>
            <p>You have not joined any games yet. </p>
            <p>Create a new one or join an existing one.</p>
            <div>
              <br />
              <button className="btn-sci-fi" onClick={handleCreateGame}>
                Create New Game
              </button>
              <br />
              <br />
              <button
                className="btn-sci-fi"
                onClick={() =>
                  inputGameID
                    ? handleJoinGame(inputGameID)
                    : displayMessage("Please enter a game ID")
                }
              >
                Join Game
              </button>
              <input
                type="text"
                className="text-black mr-4 border border-gray-300 rounded-md h-10 px-3"
                placeholder="Enter Game ID"
                value={inputGameID ? inputGameID.toString() : ""} // TODO: must be a better way to do this
                onChange={(e) => setInputGameID(BigInt(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lobby;
