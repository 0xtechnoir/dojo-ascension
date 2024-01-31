import { request, gql } from "graphql-request";
import { Component } from "@dojoengine/recs";
import { useDojo } from "../dojo/useDojo";
import { LogMessage } from "../CustomTypes";
import { formatDate, decodeComponent } from "../utils";
import { useGameContext } from "../hooks/GameContext";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { dojoConfig, Config } from "../dojo/dojoConfig";

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

interface EventData {
  id: string;
  keys: string[];
  data: string[];
}

interface EventNode {
  node: EventData;
}

interface EventResponse {
  events: {
    edges: Array<EventNode>;
  };
}

const ActivityLog = () => {
  const { playerInGameId } = useGameContext();
  const {
    setup: {
      clientComponents: { 
        PlayerSpawned, 
        GameStarted, 
        PlayerMoved, 
        RangeIncreased, 
        ActionPointClaimed, 
        VotingPointClaimed, 
        ActionPointSent, 
        AttackExecuted, 
        PlayerKilled, 
        Voted, 
        GameEnded
      },
    },
  } = useDojo();
  const [mappedLogs, setMappedLogs] = useState<LogMessage[]>([]);
  const gameId =
    playerInGameId && !isNaN(playerInGameId)
      ? BigInt(playerInGameId)
      : undefined;

  type EventKeys =
    | "0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618"
    | "0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88"
    | "0x132cd782aa62d9aeaf17b71256b4984aef1930fc3abb2d5b81183ee54d1f163"
    | "0xcd3e910d4efa8a6899aebb7244a6361959f3a46a3c83e52e649ff4ee2a0a8a"
    | "0x338d93a35a22a7a679290da3c6aa761d8dc5e6d76c29393988931822a94904a"
    | "0x3f19426f3812c771d044ef4d646d0345415d2636394e53cccc96dfff31dbbea"
    | "0x336450c9dbe80edc71de7ca94ea864f1006faa781d8ba191dd2f3306759eda9"
    | "0x28edb7159a81913ade44703effb727b50fbe761b237a0a42743215ca20b2350"
    | "0x108e40ed49a9dc8b294b18c7b4a3b8c9e5f21020472e9c33eacd4bdad00b978"
    | "0x5c9afac1c510b50d3e0004024ba7b8e190864f1543dd8025d08f88410fb162"
    | "0x269815c7349de3f698b18cc6e3078fbd85947f74a2d27c2d192efa260b954b6";

  const logTypes: Record<EventKeys, Component> = {
    "0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618": PlayerSpawned,
    "0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88": GameStarted,
    "0x132cd782aa62d9aeaf17b71256b4984aef1930fc3abb2d5b81183ee54d1f163": PlayerMoved,
    "0xcd3e910d4efa8a6899aebb7244a6361959f3a46a3c83e52e649ff4ee2a0a8a": RangeIncreased,
    "0x338d93a35a22a7a679290da3c6aa761d8dc5e6d76c29393988931822a94904a": ActionPointClaimed,
    "0x3f19426f3812c771d044ef4d646d0345415d2636394e53cccc96dfff31dbbea": VotingPointClaimed,
    "0x336450c9dbe80edc71de7ca94ea864f1006faa781d8ba191dd2f3306759eda9": ActionPointSent,
    "0x28edb7159a81913ade44703effb727b50fbe761b237a0a42743215ca20b2350": AttackExecuted,
    "0x108e40ed49a9dc8b294b18c7b4a3b8c9e5f21020472e9c33eacd4bdad00b978": PlayerKilled,
    "0x5c9afac1c510b50d3e0004024ba7b8e190864f1543dd8025d08f88410fb162": Voted,
    "0x269815c7349de3f698b18cc6e3078fbd85947f74a2d27c2d192efa260b954b6": GameEnded,
  };

  const logTypesKeys = Object.keys(logTypes);
  const {
    VITE_PUBLIC_TORII,
  } = import.meta.env;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allEvents: EventNode[] = [];
        for (const key of logTypesKeys) {
          const variables = {
            keys: [
              key,
              "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc",
            ],
          };
          const config: Config = dojoConfig();
          const response: EventResponse = await request(
            (VITE_PUBLIC_TORII + '/graphql'),
            document,
            variables
          );
          allEvents = allEvents.concat(response.events.edges);
        }

        processEvents(allEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processEvents = (allEvents: EventNode[]) => {
      // Code implementation
      setMappedLogs((prevLogs) => {
        const newLogIds = new Set(prevLogs.map((log) => log.id));
        const newLogs = allEvents
          .filter((edge) => isRelevantEvent(edge))
          .map((edge) => createLogMessage(edge))
          .filter(
            (log): log is LogMessage => log !== null && !newLogIds.has(log.id)
          );

        return [...prevLogs, ...newLogs].sort(
          (a, b) => b.timestamp - a.timestamp
        );
      });
    };

    const isRelevantEvent = (edge: EventNode): boolean => {
      const key = edge.node.keys[0] as EventKeys;
      const logTypeComponent = logTypes[key];
      if (!logTypeComponent) return false;

      const decodedData = decodeComponent(logTypeComponent, edge.node.data);
      return decodedData.gameId === gameId;
    };

    const createLogMessage = (edge: EventNode): LogMessage | null => {
      const key = edge.node.keys[0] as EventKeys;
      const componentType = logTypes[key]; // Assuming first key defines the log type
      if (!componentType) return null;

      const decodedData = decodeComponent(componentType, edge.node.data);
      if (decodedData.gameId !== gameId) return null;

      switch (componentType) {
        case PlayerSpawned:
          const player = shortString.decodeShortString(decodedData.player);
          const x = decodedData.at.x;
          const y = decodedData.at.y;
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${player} spawned at (${x}, ${y})`,
          };

        case GameStarted:
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.startTime),
            message: `Game started`,
          };

        case PlayerMoved:
          const playerMoved = shortString.decodeShortString(decodedData.player);
          const fromx = decodedData.from.x;
          const fromy = decodedData.from.y;
          const tox = decodedData.to.x;
          const toy = decodedData.to.y;
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${playerMoved} moved from (${fromx}, ${fromy}) to (${tox}, ${toy})`,
          };

        case RangeIncreased:
          const playerRangeIncreased = shortString.decodeShortString(decodedData.player);
          const newRange = decodedData.newRange;
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${playerRangeIncreased} increased their range to ${newRange}`,
          };

        case ActionPointClaimed:
          const playerActionPointClaimed = shortString.decodeShortString(decodedData.player);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${playerActionPointClaimed} claimed an action point`,
          };
        
        case VotingPointClaimed:
          const claimer = shortString.decodeShortString(decodedData.player);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${claimer} claimed a voting point`,
          };
        
        case ActionPointSent:
          const sender = shortString.decodeShortString(decodedData.sender);
          const receiver = shortString.decodeShortString(decodedData.receiver);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${sender} sent an action point to ${receiver}`,
          };

        case AttackExecuted:
          const attacker = shortString.decodeShortString(decodedData.attacker);
          const target = shortString.decodeShortString(decodedData.target);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${attacker} attacked ${target}`,
          };
        
        case PlayerKilled:
          const killer = shortString.decodeShortString(decodedData.killer);
          const killed = shortString.decodeShortString(decodedData.killed);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${killer} killed ${killed}`,
          };

        case Voted:
          const voter = shortString.decodeShortString(decodedData.voter);
          const candidate = shortString.decodeShortString(decodedData.receiver);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `${voter} sent an action point to ${candidate}`,
          };

        case GameEnded:
          const winningPlayer = shortString.decodeShortString(decodedData.winning_player);
          return {
            id: edge.node.id,
            timestamp: Number(decodedData.timestamp),
            message: `Game ended, ${winningPlayer} won!`,
          };

        default:
          return null;
      }
    };

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [
    playerInGameId, 
    GameStarted, 
    PlayerSpawned, 
    PlayerMoved,
    RangeIncreased,
    ActionPointClaimed,
    VotingPointClaimed,
    ActionPointSent,
    AttackExecuted,
    PlayerKilled,
    Voted,
    GameEnded 
  ]);

  return (
    <div className="h-full items-start p-3 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Ships Log:</h1>
      <ul className="text-white text-left">
        {mappedLogs.map((log, index) => (
          <li key={index} className="mb-1">
            <span className="text-gray-400 text-sm">
              {formatDate(log.timestamp)}
            </span>
            <span className="text-orange-400 text-sm"> : </span>
            <span className="text-white text-sm">{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
