import { useEffect, useState } from "react";
import { useDojo } from "./dojo/useDojo";
import { ErrorWithShortMessage } from "./CustomTypes";
import { useGameContext } from "./GameContext";

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
  const { gameId } = useGameContext();

  const clearMoveMessage = () => {
    setMoveMessage("");
  };

  useEffect(() => {
    const listener = async (e: KeyboardEvent) => {
      console.log("moveby account address: ", account.address)
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

  return { moveMessage, clearMoveMessage };
};
