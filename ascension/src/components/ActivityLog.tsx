import { request, gql } from "graphql-request";
import { Component } from "@dojoengine/recs";
import { useDojo } from "../dojo/useDojo";
import { LogMessage } from "../CustomTypes";
import { formatDate, decodeComponent } from "../utils";
import { useGameContext } from "../hooks/GameContext";
import { useEffect, useState } from "react";
import { shortString } from "starknet";

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
      clientComponents: { PlayerSpawned, GameStarted },
    },
  } = useDojo();
  const [mappedLogs, setMappedLogs] = useState<LogMessage[]>([]);
  const gameId =
    playerInGameId && !isNaN(playerInGameId)
      ? BigInt(playerInGameId)
      : undefined;

  type EventKeys =
    | "0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618"
    | "0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88";

  const logTypes: Record<EventKeys, Component> = {
    "0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618": PlayerSpawned,
    "0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88": GameStarted,
  };

  const logTypesKeys = Object.keys(logTypes);

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
          const response: EventResponse = await request(
            "http://0.0.0.0:8080/graphql/",
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
          (a, b) => a.timestamp - b.timestamp
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
          const x = decodedData.position.x;
          const y = decodedData.position.y;
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

        default:
          return null;
      }
    };

    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [playerInGameId, PlayerSpawned]); // Only re-run effect if playerInGameId or PlayerSpawned changes

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
