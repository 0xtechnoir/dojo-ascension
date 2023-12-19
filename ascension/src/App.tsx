import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Has, HasValue, Entity, getComponentValue } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./DojoContext";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GameBoard } from "./GameBoard";
import { useGameContext } from "./GameContext";
import Lobby from "./Lobby";
import { ErrorWithShortMessage } from "./CustomTypes";
import { PlayersList } from "./PlayersList";
import SpawnModal from "./SpawnModal";
import LeaveGameModal from "./LeaveGameModal";
import RulesModal from "./RulesModal";

function App() {
    const {
        setup: {
            components: { Moves, Position, Player, GameSession },
        },
        account: {
            account,
            isDeploying,
            clear,
            copyToClipboard,
            applyFromClipboard,
        },
    } = useDojo();

    const {
        displayMessage,
        gameId,
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

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const gameSessions = useEntityQuery([Has(GameSession)]);
    const currentGameID = useComponentValue(Player, entityId)?.inGame;

    // get current component values
    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);

    useEffect(() => {
        // Hide spawn button if player is already spawned
        const playerEntityExists = getComponentValue(Player, entityId) || false;
        if (playerEntityExists && currentGameID) {
          setShowSpawnButton(false);
          setShowLeaveGameButton(true);
        } else {
          setShowSpawnButton(true);
          setShowLeaveGameButton(false);
        }
      });

    const allPlayers = useEntityQuery([
        // HasValue(InGame, { value: gameId! }),
        Has(Player),
        // Has(Position),
      ]);

    let gameIsLive = false;
    if (gameSessions) {
        // loop through gameSessions and find the one with the matching gameId
        for (let i = 0; i < gameSessions.length; i++) {
          const gameSession = gameSessions[i];
          const rec = getComponentValue(GameSession, gameSession);
          console.dir(rec);
          if (rec?.gameId === gameId) {
            gameIsLive = rec.isLive;
            setGameIsWon(rec.isWon);
          }
        }
      }

    const handleSpawnClick = () => {
        setShowSpawnModal(true);
    };

    const handleLeaveGameClick = () => {
        setShowLeaveGameModal(true);
      };

    // const handleRestoreBurners = async () => {
    //     try {
    //         await applyFromClipboard();
    //         setClipboardStatus({
    //             message: "Burners restored successfully!",
    //             isError: false,
    //         });
    //     } catch (error) {
    //         setClipboardStatus({
    //             message: `Failed to restore burners from clipboard`,
    //             isError: true,
    //         });
    //     }
    // };

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
            console.log("start match")
        //   await startMatch(gameId, playersSpawned, startTime);
        } catch (error) {
          if (typeof error === "object" && error !== null) {
            const message = (error as ErrorWithShortMessage).cause.data.args[0];
            displayMessage(message);
          }
        }
      };

    // return (
    //     <>
    //         <button onClick={create}>
    //             {isDeploying ? "deploying burner" : "create burner"}
    //         </button>
    //         {list().length > 0 && (
    //             <button onClick={async () => await copyToClipboard()}>
    //                 Save Burners to Clipboard
    //             </button>
    //         )}
    //         <button onClick={handleRestoreBurners}>
    //             Restore Burners from Clipboard
    //         </button>
    //         {clipboardStatus.message && (
    //             <div className={clipboardStatus.isError ? "error" : "success"}>
    //                 {clipboardStatus.message}
    //             </div>
    //         )}

    //         <div className="card">
    //             select signer:{" "}
    //             <select
    //                 value={account ? account.address : ""}
    //                 onChange={(e) => select(e.target.value)}
    //             >
    //                 {list().map((account, index) => {
    //                     return (
    //                         <option value={account.address} key={index}>
    //                             {account.address}
    //                         </option>
    //                     );
    //                 })}
    //             </select>
    //             <div>
    //                 <button onClick={() => clear()}>Clear burners</button>
    //             </div>
    //         </div>

    //         <div className="card">
    //             <button onClick={() => spawn(account)}>Spawn</button>
    //             <div>
    //                 Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
    //             </div>
    //             <div>
    //                 Position:{" "}
    //                 {position
    //                     ? `${position.vec.x}, ${position.vec.y}`
    //                     : "Need to Spawn"}
    //             </div>
    //         </div>

    //         <div className="card">
    //             <div>
    //                 <button
    //                     onClick={() =>
    //                         position && position.vec.y > 0
    //                             ? move(account, Direction.Up)
    //                             : console.log("Reach the borders of the world.")
    //                     }
    //                 >
    //                     Move Up
    //                 </button>
    //             </div>
    //             <div>
    //                 <button
    //                     onClick={() =>
    //                         position && position.vec.x > 0
    //                             ? move(account, Direction.Left)
    //                             : console.log("Reach the borders of the world.")
    //                     }
    //                 >
    //                     Move Left
    //                 </button>
    //                 <button onClick={() => move(account, Direction.Right)}>
    //                     Move Right
    //                 </button>
    //             </div>
    //             <div>
    //                 <button onClick={() => move(account, Direction.Down)}>
    //                     Move Down
    //                 </button>
    //             </div>
    //             <div className="m-2 bg-slate-900 border border-gray-700 p-2 rounded-md">
    //                 <GameBoard players={allPlayers} />
    //             <br />
    //           </div>
    //         </div>
    //     </>
    // );
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-space-bg">
          <div className="flex justify-center">
            {!showGameBoard ? (
              <Lobby
                setShowGameBoard={setShowGameBoard}
                showGameBoard={showGameBoard}
                currentGameID={currentGameID}
              />
            ) 
            // : syncProgress.step !== SyncStep.LIVE ? (
            //   <div>
            //     {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
            //   </div>
            // ) 
            : (
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
                  {currentGameID ? (
                    <>
                      <p>
                        Game ID:{" "}
                        <strong className="text-orange-500 bg-gray-800 p-1 rounded-md">
                          {currentGameID}
                        </strong>
                        (Share this with other players so they can join your game)
                      </p>
                    </>
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
                    {/* <ActivityLogComponent /> */}
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
                  setShowGameBoard={setShowGameBoard}
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
