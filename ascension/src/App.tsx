import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Has, HasValue, Entity, getComponentValue, getComponentValueStrict, ComponentValue } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./DojoContext";
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
            components: { Moves, Position, Player, GameSession, InGame },
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
    const [currentGameID, setCurrentGameID] = useState<number | undefined>(undefined);
    const [playerEntity, setPlayerEntity] = useState<ComponentValue | null>(null); 


    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const gameSessions = useEntityQuery([Has(GameSession)]);
    // entity id we are syncing
    // const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    // console.log("entityId: ", entityId);
    // const fetchedPlayerEntity = getComponentValue(Player, entityId);
    // console.log("fetchedPlayerEntity: ", fetchedPlayerEntity);
    // // const currentGameID = useComponentValue(InGame, entityId)?.gameId;
    
    // useEffect(() => {
    //   if (fetchedPlayerEntity) {
    //     setCurrentGameID(Number(fetchedPlayerEntity.gameId));
    //     console.log("currentGameID: ", currentGameID);
    //   }
    //   // Other dependencies might be necessary depending on when you want this effect to run
    // }, [fetchedPlayerEntity]);
    
    
// 
    // get current component values
    // const position = useComponentValue(Position, entityId);
    // console.log("+++position+++: ", position);
    // const moves = useComponentValue(Moves, entityId);
   
    // const newGameId = Number(useComponentValue(InGame, entityId)?.gameId);

    useEffect(() => {
      console.log("playerInGameId: ", playerInGameId);
      // Use the fetched value directly in this effect
      if (playerInGameId) {
        setShowSpawnButton(false);
        setShowLeaveGameButton(true);
      } else {
        setShowSpawnButton(true);
        setShowLeaveGameButton(false);
      }
      // Only after all these operations, update the playerEntity state
      // setPlayerEntity(fetchedPlayerEntity);
    }, [playerInGameId]); // Make sure entityId is the dependency if it affects fetchedPlayerEntity

    // useEffect(() => {
    //   console.log("useEffect called ==========");
    //   const fetchedPlayerEntity = getComponentValue(Player, entityId) || null;
    //   console.log("fetchedPlayerEntity: ", fetchedPlayerEntity);
    //   setPlayerEntity(fetchedPlayerEntity);
    //   console.log("playerEntity: ", playerEntity);
    //   if (playerEntity) {
    //     console.log("useEffect branch 1 taken")
    //     console.log("playerEntity.gameId: ", playerEntity.gameId);
    //     setCurrentGameID(Number(playerEntity.gameId));
    //     setShowSpawnButton(false);
    //     setShowLeaveGameButton(true);
    //   } else {
    //     console.log("useEffect branch 2 taken")
    //     setShowSpawnButton(true);
    //     setShowLeaveGameButton(false);
    //   }
    // }, []);
    //
    // useEffect(() => {
    //     // Hide spawn button if player is already spawned
    //     // console.log("useEffect currentGameID: ", currentGameID)
    //     // console.log("useEffect entityId: ", entityId)
    //     console.log("playerEntity: ", playerEntity);
    //     if (playerEntity) {
    //       console.log("1")
    //       setCurrentGameID(Number(playerEntity.gameId));
    //       setShowSpawnButton(false);
    //       setShowLeaveGameButton(true);
    //     } else {
    //       setShowSpawnButton(true);
    //       setShowLeaveGameButton(false);
    //     }
    //   });
    // console.log("currentGameID: ", currentGameID);
    const allPlayers = useEntityQuery([
        Has(Player),
      ]);
    // console.log("allPlayers: ", allPlayers);
    
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
          console.log("start match")
        await startMatch(account, BigInt(gameId), playersSpawned, startTime);
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          const message = (error as ErrorWithShortMessage).cause.data.args[0];
          displayMessage(message);
        }
      }
    };
       
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-space-bg">
          <div className="flex justify-center">
            {!showGameBoard ? (
              <Lobby
                showGameBoard={showGameBoard}
                currentGameID={playerInGameId}
              />
            ) 
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
