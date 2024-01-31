import { useGameContext } from "../hooks/GameContext";
import { extractErrorMessage } from "../utils";

type ActionButtonProps = {
  label: string;
  action: () => () => Promise<void>;
  buttonStyle?: string;
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  action,
  buttonStyle = "",
}) => {
  const { displayMessage, gameId } = useGameContext();
  return (
    <button
      className={buttonStyle}
      type="button"
      onClick={async () => {
        if (!gameId) {
          displayMessage("No game ID found. Have you joined a game?");
          return;
        }
        try {
          const actionToExecute = action();
          await actionToExecute();
        } catch (error) {
          if (error instanceof Error) {
            const message = extractErrorMessage(error.message);
            message ? displayMessage(message) : null;
          }
        }
      }}
    >
      {label}
    </button>
  );
};
