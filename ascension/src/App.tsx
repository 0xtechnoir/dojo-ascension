import { useEntityQuery } from "@dojoengine/react";
import {
  Has,
  HasValue,
  getComponentValue,
  ComponentValue,
} from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./DojoContext";
import { GameBoard } from "./GameBoard";
import { useGameContext } from "./GameContext";
import Lobby from "./Lobby";
import ActivityLog from "./ActivityLog";
import { ErrorWithShortMessage } from "./CustomTypes";
import { PlayersList } from "./PlayersList";
import SpawnModal from "./SpawnModal";
import LeaveGameModal from "./LeaveGameModal";
import RulesModal from "./RulesModal";
import { extractErrorMessage } from "./utils";

function App() {
  const {
    setup: {
      components: { Player, GameSession },
      systemCalls: { startMatch },
    },
    account: {
      account,
      create,
      isDeploying,
      clear,
      copyToClipboard,
      applyFromClipboard,
    },
  } = useDojo();

  const {
    displayMessage,
    gameId,
    playerInGameId,
    showGameBoard,
    setShowGameBoard,
    setGameIsWon,
    gameIsWon,
  } = useGameContext();

  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const [showSpawnButton, setShowSpawnButton] = useState(true);
  const [showLeaveGameButton, setShowLeaveGameButton] = useState(true);
  const [showLeaveGameModal, setShowLeaveGameModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  const gameSessions = useEntityQuery([Has(GameSession)]);

  useEffect(() => {
    // Use the fetched value directly in this effect
    if (playerInGameId) {
      setShowSpawnButton(false);
      setShowLeaveGameButton(true);
    } else {
      setShowSpawnButton(true);
      setShowLeaveGameButton(false);
    }
  }, [playerInGameId]); // Make sure entityId is the dependency if it affects fetchedPlayerEntity

  const allPlayers = useEntityQuery([
    Has(Player),
    HasValue(Player, {
      gameId:
        playerInGameId !== null && !isNaN(playerInGameId)
          ? BigInt(playerInGameId)
          : undefined,
    }),
  ]);

  // const playerPosition = useComponentValue(Position, allPlayers[0])
  // console.log('player position: ', playerPosition);

  // const mappedPlayers = allPlayers.map((entity) => {
  //   const position = getComponentValue(Position, entity)
  //   console.log('position: ', position);
  // });

  // const playerPosition = getComponentValue(Position, allPlayers[0]);
  // console.log("playerPosition: ", playerPosition);

  let gameIsLive = false;
  if (gameSessions) {
    // loop through gameSessions and find the one with the matching gameId
    for (let i = 0; i < gameSessions.length; i++) {
      const gameSession = gameSessions[i];
      const rec = getComponentValue(GameSession, gameSession);
      // console.dir(rec);
      if (rec && Number(rec?.gameId) === gameId) {
        gameIsLive = rec.isLive;
        // setGameIsWon(rec.isWon);
      }
    }
  }

  const handleSpawnClick = () => {
    setShowSpawnModal(true);
  };

  const handleLeaveGameClick = () => {
    setShowLeaveGameModal(true);
  };
  //
  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: "", isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  const start = async () => {
    const playersSpawned = allPlayers.length;
    const startTime = Date.now();
    if (!gameId) {
      throw new Error("No game ID found");
    }
    try {
      await startMatch(account, gameId, playersSpawned, startTime);
    } catch (error: any) {
      if (error instanceof Error) {
        const message = extractErrorMessage(error.message);
        console.log("message: ", message);
        message ? displayMessage(message) : null
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-space-bg">
      <div className="flex justify-center">
        {!showGameBoard ? (
          <Lobby showGameBoard={showGameBoard} currentGameID={playerInGameId} />
        ) : (
          <div
            className={`flex flex-col ${
              showSpawnModal ? "blur-md" : ""
            } w-full h-full`}
          >
            <div className="m-2 flex items-start border border-gray-700 p-3 rounded-md bg-slate-900">
              {showSpawnButton ? (
                <button className="btn-sci-fi" onClick={handleSpawnClick}>
                  Spawn
                </button>
              ) : (
                <button
                  onClick={start}
                  className={`text-white  ${
                    gameIsLive ? "btn-active" : "btn-sci-fi"
                  }`}
                  disabled={gameIsLive}
                >
                  {gameIsLive ? "Match Started" : "Start Match"}
                </button>
              )}
              {showLeaveGameButton && (
                <button className="btn-sci-fi" onClick={handleLeaveGameClick}>
                  Leave Game
                </button>
              )}
              <button
                className="btn-sci-fi"
                onClick={() => setShowGameBoard(false)}
              >
                Back to Lobby
              </button>
              <button
                className="btn-sci-fi"
                onClick={() => setShowRulesModal(true)}
              >
                Rules
              </button>
              <br />
              {playerInGameId ? (
                <p>
                  Game ID:{" "}
                  <strong className="text-orange-500 bg-gray-800 p-1 rounded-md">
                    {String(playerInGameId)}
                  </strong>
                  (Share this with other players so they can join your game)
                </p>
              ) : (
                <p>Spawn to get a sharable game ID</p>
              )}
            </div>
            <div className="flex justify-center">
              <div className="m-2 flex-col w-1/3 bg-slate-900 border border-gray-700 p-2 min-w-[30rem] max-h-[40rem] rounded-md overflow-auto">
                <PlayersList players={allPlayers} />
              </div>
              <div className="m-2 bg-slate-900 border border-gray-700 p-2 rounded-md">
                <GameBoard players={allPlayers} />
                <br />
              </div>
              <div className="m-2 w-1/3 bg-slate-900 border border-gray-700 p-2 min-w-[30rem] max-h-[40rem] rounded-md overflow-auto">
                <ActivityLog />
              </div>
            </div>
            <SpawnModal
              showSpawnModal={showSpawnModal}
              setShowSpawnModal={setShowSpawnModal}
              setShowSpawnButton={setShowSpawnButton}
            />
            <LeaveGameModal
              showLeaveGameModal={showLeaveGameModal}
              setShowLeaveGameModal={setShowLeaveGameModal}
              setShowLeaveGameButton={setShowLeaveGameButton}
            />
            <RulesModal
              showRulesModal={showRulesModal}
              setShowRulesModal={setShowRulesModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
