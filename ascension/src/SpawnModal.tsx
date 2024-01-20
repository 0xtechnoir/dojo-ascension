import React, { useState } from "react";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { useGameContext } from "./GameContext";
import { ErrorWithShortMessage } from "./CustomTypes";
import Modal from '@mui/material/Modal';
import { useDojo } from "./DojoContext";
import { getEntityIdFromKeys } from "@dojoengine/utils";

type SpawnModalProps = {
  showSpawnModal: boolean;
  setShowSpawnModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSpawnButton: React.Dispatch<React.SetStateAction<boolean>>;
};

const SpawnModal: React.FC<SpawnModalProps> = ({
  showSpawnModal: showSpawnModal,
  setShowSpawnModal: setShowSpawnModal,
  setShowSpawnButton,
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState("");

  // Contexts
  const { displayMessage, gameId, setPlayerInGameId } = useGameContext();

  const {
    setup: {
      components: { Player },
      systemCalls: { spawn },
    },
    account: { 
      account, 
    },
  } = useDojo();

  const sanitizeInput = (input: string) => {
    let sanitized = input.trim();
    if (sanitized.length < 3 || sanitized.length > 20) {
      setError("Username must be between 3 and 20 characters.");
      return null;
    }
    if (/[^a-zA-Z0-9_]/.test(sanitized)) {
      // Only allow alphanumeric and underscore
      setError("Username can only contain letters, numbers, and underscores.");
      return null;
    }
    return sanitized;
  };

  const onSubmit = async () => {
    setError("");
    setIsLoading(true);
    const sanitizedUsername = sanitizeInput(enteredUsername);

    if (!sanitizedUsername) {
      setIsLoading(false);
      return; // Stop if invalid
    }
    try {
      if (!gameId) {
        throw new Error("No game ID found");
      }
      console.log("Account address [SpawnModal.tsx - onSubmit()]: ", account.address);
      await spawn(account, sanitizedUsername, BigInt(gameId));
      setShowSpawnButton(false);
      const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
      const id = getComponentValue(Player, entityId)?.gameId;
      setPlayerInGameId(Number(id));

    } catch (error) {
      console.log("handleModalSubmit error: ", error);
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).cause.data.args[0];
        displayMessage(message);
      }
    } finally {
      setIsLoading(false);
      setShowSpawnModal(false);
    }
  };

  const dismissError = () => {
    setError("");
  };

  const handleCloseSpawnModal = () => {
    setShowSpawnModal(false);
    dismissError();
  };

  return (
    <Modal
      onClose={handleCloseSpawnModal}
      open={showSpawnModal}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-black relative">
        <button
          onClick={handleCloseSpawnModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
        >
          X
        </button>
        <h2 className="text-2xl mb-4">Enter a Username</h2>
        {error ? (
          <div className="text-red-500">
            {error}
            <br />
            <br />
            <button onClick={dismissError} className="btn-sci-fi">
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="text-gray-500">Spawning, please wait...</div>
        ) : (
          <div>
            <input
              type="text"
              autoFocus // Set autofocus here
              onChange={(e) => setEnteredUsername(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter" && enteredUsername.trim() !== "") {
                  onSubmit();
                }
              }}
              className="border rounded p-2 w-full"
            />
            <br />
            <br />
            <button onClick={onSubmit} className="btn-sci-fi">
              Submit
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SpawnModal;
