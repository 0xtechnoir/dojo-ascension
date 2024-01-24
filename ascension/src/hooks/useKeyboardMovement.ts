import { useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { ErrorWithShortMessage } from "../CustomTypes";
import { useGameContext } from "./GameContext";
import { Direction } from "../utils";

export const useKeyboardMovement = (onMove: () => void) => {

  const {
    setup: {
        systemCalls: { move }, 
    },
    account: {
      account,
    },
  } = useDojo();

  const [moveMessage, setMoveMessage] = useState<string>("");
  const { gameId } = useGameContext();

  const clearMoveMessage = () => {
    setMoveMessage("");
  };

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      try {
        if (gameId) {
          let moved = false;
          if (e.key === "ArrowUp" || e.key === "w") {
            await move(account, gameId, Direction.Up );
            moved = true;
          }
          if (e.key === "ArrowDown" || e.key === "s") {
            await move(account, gameId, Direction.Down);
            moved = true;
          }
          if (e.key === "ArrowLeft" || e.key === "a") {
            await move(account, gameId, Direction.Left);
            moved = true;
          }
          if (e.key === "ArrowRight" || e.key === "d") {
            await move(account, gameId, Direction.Right);
            moved = true;
          }
          if (moved) {
            onMove(); // Call the callback when a move is made
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
  }, [move, onMove]);

  return { moveMessage, clearMoveMessage };
};
