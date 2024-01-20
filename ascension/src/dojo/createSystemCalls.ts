import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import {
  getEntityIdFromKeys,
  getEvents,
  setComponentsFromEvents,
} from "@dojoengine/utils";
import {
  shortString,
  RejectedTransactionReceiptResponse,
  RevertedTransactionReceiptResponse,
} from "starknet";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

// define custom struct type called Vec2 that has two 32-bit integer coordinates
export type Vec2 = {
  x: number;
  y: number;
};

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Position, Player, GameSession }: ClientComponents
) {
  const spawn = async (account: Account, username: string, gameId: bigint) => {
    const encodedUsername: string = shortString.encodeShortString(username);
    const timestamp = Date.now();
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: entityId,
      value: { gameId: gameId },
    });

    try {
      const { transaction_hash } = await execute(account, "actions", "spawn", [
        timestamp,
        encodedUsername,
        gameId,
      ]);

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          })
        )
      );
    } catch (e) {
      console.log(e);
      Player.removeOverride(playerId);
    } finally {
      Player.removeOverride(playerId);
    }
  };

  const startMatch = async (
    account: Account,
    gameId: number,
    playersSpawned: number,
    startTime: number
  ) => {
    let tx;
    let receipt;
    try {
      tx = await execute(account!, "actions", "startMatch", [
        BigInt(gameId),
        playersSpawned,
        BigInt(startTime),
      ]);
      receipt = await account!.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    }

    if (receipt && receipt.status === "REJECTED") {
      throw Error(
        (receipt as RejectedTransactionReceiptResponse)
          .transaction_failure_reason.error_message
      );
    }

    if (receipt && receipt.execution_status === "REVERTED") {
      throw Error(
        (receipt as RevertedTransactionReceiptResponse).revert_reason ||
          "Transaction Reverted"
      );
    }
  };

  const move = async (
    account: Account,
    deltaX: number,
    deltaY: number,
    gameId: number
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;

    console.log(
      "Account address [createSystemCalls.ts - move()]: ",
      account.address
    );
    console.log("Entity ID [createSystemCalls.ts - move()]: ", entityId);

    // get players current position
    const playerPosition = getComponentValue(Position, entityId);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }
    const { x, y } = playerPosition.vec as Vec2;

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: entityId,
      value: {
        player: BigInt(entityId),
        game_id: BigInt(gameId),
        vec: {
          x: x + deltaX,
          y: y + deltaY,
        },
      },
    });

    let tx, receipt;
    try {
      const bigIntTimestamp = BigInt(Date.now());
      tx = await execute(account, "actions", "move", [
        bigIntTimestamp,
        deltaX,
        deltaY,
        BigInt(gameId),
      ]);
      receipt = await account!.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
      Position.removeOverride(positionId);
    } finally {
      Position.removeOverride(positionId);
    }

    if (receipt && receipt.status === "REJECTED") {
      throw Error(
        (receipt as RejectedTransactionReceiptResponse)
          .transaction_failure_reason.error_message
      );
    }

    if (receipt && receipt.execution_status === "REVERTED") {
      throw Error(
        (receipt as RevertedTransactionReceiptResponse).revert_reason ||
          "Transaction Reverted"
      );
    }
  };

  const sendActionPoint = async (entity: Entity, gameId: number | null) => {
    console.log("sendActionPoint");
  };

  const attack = async (entity: Entity, gameId: number | null) => {
    console.log("attack");
  };

  const increaseRange = async (gameId: number | null) => {
    console.log("increaseRange");
  };

  const claimActionPoint = async (gameId: number | null) => {
    console.log("claimActionPoint");
  };

  const vote = async (entity: Entity, gameId: number | null) => {
    console.log("vote");
  };

  const claimVotingPoint = async (gameId: number | null) => {
    console.log("claimVotingPoint");
  };

  const leaveGame = async (gameId: number | null) => {
    console.log("leaveGame");
  };

  return {
    spawn,
    move,
    sendActionPoint,
    attack,
    increaseRange,
    claimActionPoint,
    vote,
    claimVotingPoint,
    leaveGame,
    startMatch,
  };
}
