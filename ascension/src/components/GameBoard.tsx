import { useEffect, useState, useRef } from "react";
import { HasValue, Entity, getComponentValueStrict, getComponentValue } from "@dojoengine/recs";
import { useEntityQuery } from "@dojoengine/react";
import { GameMap } from "./GameMap";
import { useKeyboardMovement } from "../hooks/useKeyboardMovement";
import { useGameContext } from "../hooks/GameContext";
import { useDojo } from "../dojo/useDojo";
import { ErrorWithShortMessage } from "../CustomTypes";

interface GameBoardProps {
  players: Entity[];
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  playerEntity: Entity | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({ players }) => {
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    playerEntity: null,
  });
  const { displayMessage, gameId, setHighlightedPlayer } = useGameContext();
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref for the container

  const {
    setup: {
      contractComponents: { Position, Player, Alive, InGame },
    },
    account: { account },
  } = useDojo();

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, playerEntity: null });
  };

  const playerEntity = useEntityQuery([
    HasValue(InGame, { player: BigInt(account.address)}),
  ]);
  
  const mappedPlayers = players.map((entity) => {
    const position = getComponentValueStrict(Position, entity);
    let emoji = getComponentValue(Alive, entity)?.value
      ? entity === playerEntity[0]
        ? "🚀"
        : "🛸"
      : "💀";
      return {
        entity,
        x: position.x,
        y: position.y,
        emoji: emoji,
      };
    })

  const closeModal = () => {
    setShowUsernameInput(false);
  };

  const onRightClickPlayer = (
    event: React.MouseEvent,
    clickedPlayerEntity: Entity | null
  ) => {
    if (clickedPlayerEntity === playerEntity[0]) {
      return;
    }

    if (clickedPlayerEntity === null) {
      return;
    }

    event.preventDefault();
    setHighlightedPlayer(clickedPlayerEntity);
    // Get the bounding rectangle of the container
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      // Calculate the position relative to the container
      const x = event.clientX - containerRect.left + 50;
      const y = event.clientY - containerRect.top;
      setContextMenu({
        visible: true,
        x: x,
        y: y,
        playerEntity: clickedPlayerEntity,
      });
    }
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
  
  const { moveMessage, clearMoveMessage } = useKeyboardMovement();
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
        <GameMap 
          width={width} 
          height={height} 
          players={mappedPlayers} 
          onRightClickPlayer={onRightClickPlayer}
        />
      </div>
    </div>
  );
};
