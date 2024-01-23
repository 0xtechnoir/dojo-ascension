import { useEffect, useState, useRef } from "react";
import { Has, HasValue, Entity, getComponentValue } from "@dojoengine/recs";
import { useEntityQuery } from "@dojoengine/react";
import { GameMap } from "./GameMap";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { useGameContext } from "./GameContext";
import { useDojo } from "./dojo/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { ErrorWithShortMessage } from "./CustomTypes";

interface GameBoardProps {
  players: Entity[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const { displayMessage, gameId } = useGameContext();
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref for the container

  const {
    setup: {
      contractComponents: { Position, Player, Alive },
      systemCalls: { move },
    },
    account: { account },
  } = useDojo();

  const playerEntity = getEntityIdFromKeys([BigInt(account.address)]) as Entity;

  const deadPlayers = useEntityQuery([
    Has(Player),
    HasValue(Alive, { value: false }),
  ]);
  let mappedPlayers;
  if (playerEntity) {
    mappedPlayers = players.map((entity) => {
      const position = getComponentValue(Position, entity);
      let emoji = !deadPlayers.includes(entity)
        ? entity === playerEntity
          ? "🚀"
          : "🛸"
        : "💀";
      if (position) {
        return {
          entity,
          x: position.vec.x,
          y: position.vec.y,
          emoji: emoji,
        };
      } else {
        return null;
      }
    });
  }

  const closeModal = () => {
    setShowUsernameInput(false);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showUsernameInput) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUsernameInput]);

  // const { moveMessage, clearMoveMessage } = useKeyboardMovement();
  const [moveMessage, setMoveMessage] = useState<string>("");

  const clearMoveMessage = () => {
    setMoveMessage("");
  };

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      try {
        if (gameId) {
          if (e.key === "ArrowUp") {
            await move(account, 0, -1, gameId);
          }
          if (e.key === "ArrowDown") {
            await move(account, 0, 1, gameId);
          }
          if (e.key === "ArrowLeft") {
            await move(account, -1, 0, gameId);
          }
          if (e.key === "ArrowRight") {
            await move(account, 1, 0, gameId);
          }
        }
      } catch (error) {
        console.log("catch block triggerd. Error: ", error);
        if (typeof error === "object" && error !== null) {
          const message = (error as ErrorWithShortMessage).cause.data.args[0];
          setMoveMessage(message);
        } else {
          console.error(error);
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move]);

  useEffect(() => {
    if (moveMessage) {
      // When setting the error message, add the new message to the existing array instead of replacing it.
      displayMessage(moveMessage);
      clearMoveMessage();
    }
  }, [moveMessage]);

  const width = 11;
  const height = 11;

  return (
    <div
      ref={containerRef}
      className="h-full border border-gray-500 rounded-md relative"
    >
      {/* Top numbers */}
      <div
        className="absolute left-0 top-0"
        style={{ transform: "translateX(30px)" }}
      >
        {Array.from({ length: width }, (_, i) => (
          <div
            key={`top-${i}`}
            className="w-12 flex items-center justify-center"
            style={{
              height: "24px",
              lineHeight: "24px",
              position: "absolute",
              left: `${i * 48}px`,
            }}
          >
            {i}
          </div>
        ))}
      </div>

      {/* Side numbers */}
      <div
        className="absolute left-0 top-0"
        style={{ transform: "translateY(32px)" }}
      >
        {Array.from({ length: height }, (_, i) => (
          <div
            key={`side-${i}`}
            className="h-12 flex items-center justify-center"
            style={{
              width: "24px",
              lineHeight: "50px",
              position: "absolute",
              top: `${i * 50}px`,
            }}
          >
            {i}
          </div>
        ))}
      </div>
      <div className="flex p-6 box-border w-full h-full bg-slate-700">
        <GameMap width={width} height={height} players={mappedPlayers || []} />
      </div>
    </div>
  );
};
