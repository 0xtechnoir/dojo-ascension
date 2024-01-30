import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { useGameContext } from "../hooks/GameContext";
import { useDojo } from "../dojo/useDojo";
import { ErrorWithShortMessage } from "../CustomTypes";

type LeaveGameModalProps = {
  showLeaveGameModal: boolean;
  setShowLeaveGameModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLeaveGameButton: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveGameModal: React.FC<LeaveGameModalProps> = ({
  showLeaveGameModal: showLeaveGameModal,
  setShowLeaveGameModal: setShowLeaveGameModal,
  setShowLeaveGameButton: setShowLeaveGameButton,
}) => {
  const { gameId } = useGameContext();

  // Contexts
  const { displayMessage, setShowGameBoard } = useGameContext();

  const {
    setup: {
        systemCalls: { leaveGame },
    },
    account: { 
      account, 
    },
  } = useDojo();

  const onSubmit = async () => {
    try {
      if (!gameId) {
        throw new Error("No game ID found");
      }
      await leaveGame(account, BigInt(gameId));
      setShowLeaveGameButton(false);
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const message = (error as ErrorWithShortMessage).cause.data.args[0];
        displayMessage(message);
      }
    } finally {
      setShowLeaveGameModal(false);
      setShowGameBoard(false);
    }
  };

  const handleCloseLeaveGameModal = () => {
    setShowLeaveGameModal(false);
  };

  return (
    <Modal
      onClose={handleCloseLeaveGameModal}
      open={showLeaveGameModal}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-8 shadow-lg w-96 text-black relative">
        <button
          onClick={handleCloseLeaveGameModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
        >
          X
        </button>
        <h2 className="text-2xl mb-4">
          You are about to leave this game session.
        </h2>
        <p>If this is a live match you will not be able to rejoin.</p>
        <br />
        <button onClick={onSubmit} className="btn-sci-fi">
          Leave
        </button>
        <button onClick={handleCloseLeaveGameModal} className="btn-sci-fi">
          Stay
        </button>
      </div>
    </Modal>
  );
};

export default LeaveGameModal;
