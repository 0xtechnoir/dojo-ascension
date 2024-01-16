import { request, gql } from "graphql-request";
import { useDojo } from "./DojoContext";
import { LogMessage } from "./CustomTypes";
import { formatDate } from "./utils";
import { useGameContext } from "./GameContext";
import { useEffect, useState } from "react";
import { decodeComponent } from "./utils";
import { shortString } from "starknet";

interface EventData {
  id: string;
  keys: string[];
  data: string[];
}

interface EventResponse {
  events: {
    edges: Array<{
      node: EventData;
    }>;
  };
}

const ActivityLog = () => {
  const { playerInGameId } = useGameContext();
  const [mappedLogs, setMappedLogs] = useState<LogMessage[]>([]);

  const {
    setup: {
      components: { PlayerSpawned },
    },
  } = useDojo();

  const gameId =
    playerInGameId !== null && !isNaN(playerInGameId)
      ? BigInt(playerInGameId)
      : undefined;

  useEffect(() => {
    const fetchData = async () => {
      const document = gql`
        query GetEvents($keys: [String!]) {
          events(keys: $keys) {
            edges {
              node {
                id
                keys
                data
              }
            }
          }
        }
      `;

      const variables = {
        keys: ["0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618", "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc"]
      };
    

      try {
        const response = (await request(
          "http://0.0.0.0:8080/graphql/",
          document,
          variables
        )) as EventResponse;

        const newPlayerSpawnedLogs = response.events.edges
          .filter((edge) => {
            const decodedData = decodeComponent(PlayerSpawned, edge.node.data);
            console.log("decodedData GameId: ", decodedData.gameId);
            console.log("gameId: ", gameId);  
            if (decodedData.gameId === gameId) {
              return true;
            }
          })
          .reduce((acc: LogMessage[], edge) => {
            // check if log already exists in mappedLogs
            if (!mappedLogs.some((log) => log.id === edge.node.id)) {
              const decodedData = decodeComponent(PlayerSpawned, edge.node.data);
              const player = shortString.decodeShortString(decodedData.player);
              const ts = Number(decodedData.timestamp);
              const x = decodedData.position.x;
              const y = decodedData.position.y;
              acc.push({
                id: edge.node.id,
                timestamp: ts,
                message: `${player} spawned at (${x}, ${y})`,
              });
            }
            return acc;
            }, []);      
  
        setMappedLogs((prevLogs) =>
          [...prevLogs, ...newPlayerSpawnedLogs].sort(
            (a, b) => b.timestamp - a.timestamp
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [mappedLogs]);

  return (
    <div className="h-full items-start p-3 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Ships Log:</h1>
      <ul className="list-decimal text-white">
        {mappedLogs.map((logObj, index) => (
          <ul key={index} className="mb-1">
            <span className="text-gray-400 text-sm">{`${formatDate(
              logObj.timestamp
            )}`}</span>
            <span className="text-orange-400 text-sm"> : </span>
            <span className="text-white text-sm">{logObj.message}</span>
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;

//   const {
//     setup: {
//         components: {
//           PlayerSpawned,
//           AttackExecuted,
//           SendActionPointExecuted,
//           RangeIncreaseExecuted,
//           GameStarted,
//           GameEnded,
//           PlayerSpawned,
//           ActionPointClaimExecuted,
//           VoteExecuted,
//           VotingPointClaimExecuted,
//           PlayerDied,
//           PlayerLeftGame,
//           PlayerWon,
//         },
//     },
//     account: {
//       account,
//     },
//   } = useDojo();

//   const mapMoveLogs = () => {
//     return allMoveLogs.map((entity) => {
//       const rec = getComponentValue(MoveExecuted, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const player = rec?.player;
//       const fromX = rec?.fromX;
//       const fromY = rec?.fromY;
//       const toX = rec?.toX;
//       const toY = rec?.toY;
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} moved from (${fromX}, ${fromY}) to (${toX}, ${toY})`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapAttackLogs = () => {
//     return allAttackLogs.map((entity) => {
//       const rec = getComponentValue(AttackExecuted, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const attacker = rec?.attacker;
//       const target = rec?.target;
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${attacker} attacked ${target}`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapSendActionPointLogs = () => {
//     return allSendActionPointLogs.map((entity) => {
//       const rec = getComponentValue(SendActionPointExecuted, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const sender = rec?.sender;
//       const reciever = rec?.reciever;
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${sender} sent 1 Action Point to ${reciever}`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapRangeIncreaseLogs = () => {
//     return allRangeIncreaseLogs.map((entity) => {
//       const rec = getComponentValue(RangeIncreaseExecuted, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const player = rec?.player;
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} increased their range by 1`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapGameStartedLog = () => {
//     return gameStarted.map((entity) => {
//       const rec = getComponentValue(GameStarted, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `Game Started`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapGameEndedLog = () => {
//     setHighlightedPlayer(null);
//     return gameEnded.map((entity) => {
//       const rec = getComponentValue(GameEnded, entity);
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `Game Ended`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapPlayerLeftGameLogs = () => {
//     return allPlayerLeftGameLogs.map((entity) => {
//       const rec = getComponentValue(PlayerLeftGame, entity);
//       const player = rec?.player;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} left the game`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapPlayerDiedLogs = () => {
//     return allPlayerDiedLogs.map((entity) => {
//       const rec = getComponentValue(PlayerDied, entity);
//       const player = rec?.player;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} was destroyed`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapActionPointClaimExecutedLogs = () => {
//     return allActionPointClaimExecutedLogs.map((entity) => {
//       const rec = getComponentValue(ActionPointClaimExecuted, entity);
//       const player = rec?.player;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} claimed an action point`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapVoteExecutedLogs = () => {
//     return allVoteExecutedLogs.map((entity) => {
//       const rec = getComponentValue(VoteExecuted, entity);
//       const voter = rec?.voter;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const recipient = rec?.recipient;
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${voter} voted to send ${recipient} an additional action point`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapVotingPointClaimExecutedLogs = () => {
//     return allVotingPointClaimExecutedLogs.map((entity) => {
//       const rec = getComponentValue(VotingPointClaimExecuted, entity);
//       const player = rec?.player;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} claimed a dead player voting point`,
//       };
//       return mappedLog;
//     });
//   };

//   const mapPlayerWonLogs = () => {
//     const winner = playerWon[0];
//     if (playerWon.length > 0) {
//       const rec = getComponentValue(PlayerWon, winner);
//       const player = rec?.player;
//       const ts = rec?.timestamp;
//       const numTs = Number(ts);
//       const mappedLog: LogMessage = {
//         timestamp: numTs,
//         message: `${player} won the game`,
//       };
//       displayMessage(`Game over, ${player} won the game`);
//       return [mappedLog];
//     } else {
//       return [];
//     }
//   };

//   const allMoveLogs = useEntityQuery([
//     HasValue(MoveExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const allAttackLogs = useEntityQuery([
//     HasValue(AttackExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const allSendActionPointLogs = useEntityQuery([
//     HasValue(SendActionPointExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const allRangeIncreaseLogs = useEntityQuery([
//     HasValue(RangeIncreaseExecuted, { gameId: gameId ?? undefined }),
//   ]);

//   const allPlayerLeftGameLogs = useEntityQuery([
//     HasValue(PlayerLeftGame, { gameId: gameId ?? undefined }),
//   ]);
//   const allPlayerDiedLogs = useEntityQuery([
//     HasValue(PlayerDied, { gameId: gameId ?? undefined }),
//   ]);
//   const allActionPointClaimExecutedLogs = useEntityQuery([
//     HasValue(ActionPointClaimExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const allVotingPointClaimExecutedLogs = useEntityQuery([
//     HasValue(VotingPointClaimExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const allVoteExecutedLogs = useEntityQuery([
//     HasValue(VoteExecuted, { gameId: gameId ?? undefined }),
//   ]);
//   const gameStarted = useEntityQuery([
//     HasValue(GameStarted, { gameId: gameId ?? undefined }),
//   ]);
//   const gameEnded = useEntityQuery([
//     HasValue(GameEnded, { gameId: gameId ?? undefined }),
//   ]);
//   const playerWon = useEntityQuery([
//     HasValue(PlayerWon, { gameId: gameId ?? undefined }),
//   ]);

// useEffect(() => {
//   const newMappedLogs = [
//     ...mapPlayerSpawnedLogs(),
//     // ...mapMoveLogs(),
//     // ...mapAttackLogs(),
//     // ...mapSendActionPointLogs(),
//     // ...mapRangeIncreaseLogs(),
//     // ...mapGameStartedLog(),
//     // ...mapGameEndedLog(),
//     // ...mapPlayerLeftGameLogs(),
//     // ...mapPlayerDiedLogs(),
//     // ...mapActionPointClaimExecutedLogs(),
//     // ...mapVoteExecutedLogs(),
//     // ...mapVotingPointClaimExecutedLogs(),
//     // ...mapPlayerWonLogs(),
//   ];
//   setMappedLogs(newMappedLogs);
// }, [
//     allPlayerSpawnedLogs,
// //   allMoveLogs,
// //   allAttackLogs,
// //   allSendActionPointLogs,
// //   allRangeIncreaseLogs,
// //   gameStarted,
// //   gameEnded,
// //   allPlayerLeftGameLogs,
// //   allPlayerDiedLogs,
// //   allActionPointClaimExecutedLogs,
// //   allVoteExecutedLogs,
// //   allVotingPointClaimExecutedLogs,
// //   playerWon,
// ]);
