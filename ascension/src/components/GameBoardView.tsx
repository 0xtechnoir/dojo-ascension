import { useEffect, useState } from "react";
import React from "react";
import { PlayersList } from "./PlayersList";
import { GameBoard } from "./GameBoard";
import ActivityLog from "./ActivityLog";
import SpawnModal from "../modals/SpawnModal";
import LeaveGameModal from "../modals/LeaveGameModal";
import RulesModal from "../modals/RulesModal";
import { useDojo } from "../dojo/useDojo";
import { useGameContext } from "../hooks/GameContext";
import { extractErrorMessage } from "../utils";
import { useEntityQuery } from "@dojoengine/react";
import { Has, HasValue, getComponentValue } from "@dojoengine/recs";

const GameBoardView: React.FC = () => {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const [showSpawnButton, setShowSpawnButton] = useState(true);
  const [showLeaveGameButton, setShowLeaveGameButton] = useState(true);
  const [showLeaveGameModal, setShowLeaveGameModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const {
    setup: {
      contractComponents: { GameSession, InGame },
      systemCalls: { startMatch },
    },
    account: { account },
  } = useDojo();

  const { displayMessage, gameId, playerInGameId, setShowGameBoard } = useGameContext();

  useEffect(() => {
    if (playerInGameId) {
      setShowSpawnButton(false);
      setShowLeaveGameButton(true);
    } else {
      setShowSpawnButton(true);
      setShowLeaveGameButton(false);
    }
  }, [playerInGameId]);


  const allPlayers = useEntityQuery([
    HasValue(InGame, {
      game_id:
        playerInGameId && !isNaN(playerInGameId)
        ? BigInt(playerInGameId)
        : undefined,
    }),
  ]);
  console.log("allPlayers: ", allPlayers);

  const gameSessions = useEntityQuery([Has(GameSession)]);
  let gameIsLive = false;
  let gameIsWon = false;
  if (gameSessions) {
    // loop through gameSessions and find the one with the matching gameId
    for (let i = 0; i < gameSessions.length; i++) {
      const gameSession = gameSessions[i];
      const rec = getComponentValue(GameSession, gameSession);
      if (rec && Number(rec?.gameId) === gameId) {
        gameIsLive = rec.isLive;
        gameIsWon = rec.isWon;
        if (gameIsWon && !showGameOverModal) {
          displayMessage("Game over. Click 'Leave Game'");
          setShowGameOverModal(true);
        }
        break;
      }
    }
  }

  const handleSpawnClick = () => {
    setShowSpawnModal(true);
  };

  const handleLeaveGameClick = () => {
    setShowLeaveGameModal(true);
  };

  const start = async () => {
    const playersSpawned = allPlayers.length;
    if (!gameId) {
      throw new Error("No game ID found");
    }
    try {
      await startMatch(account, gameId, playersSpawned);
    } catch (error: any) {
      if (error instanceof Error) {
        const message = extractErrorMessage(error.message);
        console.log("message: ", message);
        message ? displayMessage(message) : null;
      }
    }
  };

  return (
    <div
      className={`flex flex-col ${
        showSpawnModal ? "blur-md" : ""
      } w-full h-full`}
    >
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
          ) : 
          !gameIsWon ? (
            <button
              onClick={start}
              className={`text-white  ${
                gameIsLive ? "btn-active" : "btn-sci-fi"
              }`}
              disabled={gameIsLive}
            >
              {gameIsLive ? "Match Started" : "Start Match"}
            </button>
          ): <> </>}
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
    </div>
  );
};

export default GameBoardView;
