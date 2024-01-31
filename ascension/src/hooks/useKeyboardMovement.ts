import { useEffect, useState } from "react";
import { useDojo } from "../dojo/useDojo";
import { useGameContext } from "./GameContext";
import { Direction } from "../utils";
import { extractErrorMessage } from "../utils";

export const useKeyboardMovement = () => {

  const {
    setup: {
        systemCalls: { move }, 
    },
    account: {
      account,
    },
  } = useDojo();

  const [moveMessage, setMoveMessage] = useState<string>("");
  const { gameId, displayMessage } = useGameContext();

  const clearMoveMessage = () => {
    setMoveMessage("");
  };

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      try {
        if (gameId) {
          if (e.key === "ArrowUp" || e.key === "w") {
            await move(account, gameId, Direction.Up );
          }
          if (e.key === "ArrowDown" || e.key === "s") {
            await move(account, gameId, Direction.Down);
          }
          if (e.key === "ArrowLeft" || e.key === "a") {
            await move(account, gameId, Direction.Left);
          }
          if (e.key === "ArrowRight" || e.key === "d") {
            await move(account, gameId, Direction.Right);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          const message = extractErrorMessage(error.message);
          message ? displayMessage(message) : null;
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [move]);

  return { moveMessage, clearMoveMessage };
};
