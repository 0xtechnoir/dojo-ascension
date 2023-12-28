import { useEffect, useState, useRef } from "react";
import { Has, HasValue, Entity, getComponentValueStrict, getComponentValue } from "@dojoengine/recs";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { GameMap } from "./GameMap";
import { useKeyboardMovement } from "./useKeyboardMovement";
import { useGameContext } from "./GameContext";
// import { Player as PlayerComponet } from "./Player";
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

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
  // const [contextMenu, setContextMenu] = useState<ContextMenuState>({
  //   visible: false,
  //   x: 0,
  //   y: 0,
  //   playerEntity: null,
  // });
  const { displayMessage, highlightedPlayer, setHighlightedPlayer } =
    useGameContext();
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref for the container

  const {
    setup: {
        components: { Moves, Position, Range, Player, Alive },
    },
    account: { 
      account, 
    },
  } = useDojo();

  const playerEntity = getEntityIdFromKeys([BigInt(account.address)]) as Entity;

  // const closeContextMenu = () => {
  //   setContextMenu({ visible: false, x: 0, y: 0, playerEntity: null });
  // };

  // const onRightClickPlayer = (
  //   event: React.MouseEvent,
  //   clickedPlayerEntity: Entity | null
  // ) => {
  //   if (clickedPlayerEntity === playerEntity) {
  //     return;
  //   }

  //   if (clickedPlayerEntity === null) {
  //     return;
  //   }

  //   event.preventDefault();
  //   setHighlightedPlayer(clickedPlayerEntity);
  //   // Get the bounding rectangle of the container
  //   const containerRect = containerRef.current?.getBoundingClientRect();
  //   if (containerRect) {
  //     // Calculate the position relative to the container
  //     const x = event.clientX - containerRect.left + 50;
  //     const y = event.clientY - containerRect.top;
  //     setContextMenu({
  //       visible: true,
  //       x: x,
  //       y: y,
  //       playerEntity: clickedPlayerEntity,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", closeContextMenu);
  //   return () => {
  //     document.removeEventListener("click", closeContextMenu);
  //   };
  // }, []);

  const deadPlayers = useEntityQuery([
    Has(Player),
    HasValue(Alive, { value: false }),
  ]);

  console.log('players: ', players);

  const mappedPlayers = players.map((entity) => {
    console.log('entity: ', entity);
    const playerId = getComponentValue(Player, entity)?.player;
    const position = getComponentValue(Position, entity);
    console.log('position: ', position);
    if (!position) return null;
    
    let emoji = !deadPlayers.includes(entity) ? (entity === playerEntity ? "🚀" : "🛸") : "💀";
    console.log ('emoji: ', emoji);
    return {
      entity,
      x: position.vec.x,
      y: position.vec.y,
      emoji: emoji,
    };
  }).filter(player => player !== null);

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
  // useEffect(() => {
  //   if (moveMessage) {
  //     // When setting the error message, add the new message to the existing array instead of replacing it.
  //     displayMessage(moveMessage);
  //     clearMoveMessage();
  //   }
  // }, [moveMessage]);

  // Function to handle the button click
  // const selectPlayer = (inputX: number, inputY: number) => {
  //   const player = mappedPlayers.find((player) => {
  //     if (!player) {
  //       return;
  //     }
  //     const position = getComponentValueStrict(Position, player.entity);
  //     return position.vec.x === inputX && position.vec.y === inputY;
  //   });

  //   if (player) {
  //     setHighlightedPlayer(player.entity);
  //   }
  // };

  // Get map width and height from MapConfig component
  // const mapConfig = useComponentValue(MapConfig, singletonEntity);
  // if (mapConfig == null) {
  //   throw new Error(
  //     "map config not set or not ready, only use this hook after loading state === LIVE"
  //   );
  // }
  // const { width, height } = mapConfig;
  const width = 11
  const height = 11

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
          // onTileClick={selectPlayer}
          players={mappedPlayers}
          // onRightClickPlayer={onRightClickPlayer}
        />
        {/* contect menu here */}
      </div>
    </div>
  );
};


// {contextMenu.playerEntity && contextMenu.visible && (
//   <div
//     className="context-menu"
//     style={{
//       position: "absolute",
//       left: `${contextMenu.x}px`,
//       top: `${contextMenu.y}px`,
//     }}
//   >
//     {/* <PlayerComponet entity={contextMenu.playerEntity} /> */}
//   </div>
// )}