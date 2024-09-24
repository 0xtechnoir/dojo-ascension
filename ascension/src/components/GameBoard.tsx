import { useEffect, useState, useRef } from "react";
import { HasValue, Entity, getComponentValueStrict, getComponentValue, Has } from "@dojoengine/recs";
import { useEntityQuery } from "@dojoengine/react";
import { GameMap } from "./GameMap";
import { useKeyboardMovement } from "../hooks/useKeyboardMovement";
import { useGameContext } from "../hooks/GameContext";
import { useDojo } from "../dojo/useDojo";
import { Player as PlayerComponent } from "./Player";
import { getEntityIdFromKeys } from "@dojoengine/utils";
// import an image from the assets folder
import rocket from "../assets/ships/ship_1.png";

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
  const { setHighlightedPlayer, gameId } = useGameContext();
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref for the container

  const {
    setup: {
      contractComponents: { Position, Alive, InGame, PlayerAddress },
    },
    account: { account },
  } = useDojo();

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, playerEntity: null });
  };


  const playerEntity = useEntityQuery([
    HasValue(PlayerAddress, { player: BigInt(account.address)}),
  ]);
  
  // entity being fed into here is current just playerId (filtered by gameID)
  const mappedPlayers = players.map((entity) => {
    const playerId = getComponentValueStrict(InGame, entity).id;
    const posEntity = getEntityIdFromKeys([
      BigInt(playerId?.toString() || "0"),
      gameId ? BigInt(gameId) : BigInt(0),
    ]) as Entity;
    const position = getComponentValueStrict(Position, posEntity);
    let emoji = getComponentValue(Alive, entity)?.value
      ? entity === playerEntity[0]
        ? <img src={rocket} alt="Rocket" className="w-6 h-6" />
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
    document.addEventListener("click", closeContextMenu);
    return () => {
      document.removeEventListener("click", closeContextMenu);
    };
  }, []);

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
  
  useKeyboardMovement();
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
        {contextMenu.playerEntity && contextMenu.visible && (
          <div
            className="context-menu"
            style={{
              position: "absolute",
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <PlayerComponent entity={contextMenu.playerEntity} />
          </div>
        )}
      </div>
    </div>
  );
};
