import React, { useState } from "react";
import { useGameContext } from "./GameContext";
import { useEntityQuery, useComponentValue } from "@dojoengine/react";
import { getComponentValue, Has, Entity } from "@dojoengine/recs";
// import { useMUD } from "./MUDContext";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface LobbyProps {
  showGameBoard: boolean;
  currentGameID: number | null;
}

const Lobby: React.FC<LobbyProps> = ({ currentGameID }) => {
  const { setGameId, displayMessage, setShowGameBoard } = useGameContext();
  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  const {
    setup: {
      components: { GameSession, Player },
    },
    account: {
      account,
      create,
      isDeploying,
      clear,
      copyToClipboard,
      applyFromClipboard,
      list,
      select,
    },
  } = useDojo();

  const [inputGameID, setInputGameID] = useState<number | null>(null);

  const allGameSessions = useEntityQuery([Has(GameSession)]);
  const allGameIds = allGameSessions.map((entity) => {
    const rec = getComponentValue(GameSession, entity);
    return Number(rec?.gameId);
  });

  const handleCreateGame = () => {
    // generate a unique 9-digit gameId
    let gameId: number;
    while (true) {
      gameId = Math.floor(100000000 + Math.random() * 900000000);
      if (!allGameIds.includes(gameId)) {
        break;
      }
    }
    setGameId(gameId);
    setShowGameBoard(true);
  };
  const handleJoinGame = (
    eventOrGameID?: React.MouseEvent<HTMLButtonElement, MouseEvent> | number
  ) => {
    let gameIDToJoin: number | null;
    if (typeof eventOrGameID === "number") {
      gameIDToJoin = eventOrGameID;
    } else {
      gameIDToJoin = inputGameID ? inputGameID : null;
    }

    if (gameIDToJoin) {
      setGameId(gameIDToJoin);
      setShowGameBoard(true);
    }
  };

  const createBurner = async () => {
    await create();
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
  };

  const selectBurner = (address: string) => {
    console.log("Lobby Burner Address: ", address);
    select(address);
    // check if entity is already in a game
    const entityId = getEntityIdFromKeys([BigInt(address)]) as Entity;
    const currentGameID = getComponentValue(Player, entityId)?.gameId;
  };

  const handleRestoreBurners = async () => {
    try {
      await applyFromClipboard();
      setClipboardStatus({
        message: "Burners restored successfully!",
        isError: false,
      });
    } catch (error) {
      setClipboardStatus({
        message: `Failed to restore burners from clipboard`,
        isError: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded shadow-md w-120 text-white bg-slate-900 border border-gray-500">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ascension</h1>
        <button className="btn-sci-fi" onClick={createBurner}>
          {isDeploying ? "deploying burner" : "create burner"}
        </button>
        {list().length > 0 && (
          <button
            className="btn-sci-fi"
            onClick={async () => await copyToClipboard()}
          >
            Save Burners to Clipboard
          </button>
        )}
        <button className="btn-sci-fi" onClick={handleRestoreBurners}>
          Restore Burners from Clipboard
        </button>
        {clipboardStatus.message && (
          <div className={clipboardStatus.isError ? "error" : "success"}>
            {clipboardStatus.message}
          </div>
        )}
        {list().length > 0 && (
          <>
            <div className="card">
              select burner:{" "}
              <select
                value={account ? account.address : ""}
                onChange={(e) => selectBurner(e.target.value)}
                className="text-black"
              >
                {list().map((account, index) => {
                  return (
                    <option value={account.address} key={index}>
                      {account.address}
                    </option>
                  );
                })}
              </select>
              <div>
                <br />
                <button className="btn-sci-fi" onClick={() => clear()}>
                  Clear burners
                </button>
              </div>
            </div>
            <div>
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
                      onChange={(e) => setInputGameID(Number(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lobby;
