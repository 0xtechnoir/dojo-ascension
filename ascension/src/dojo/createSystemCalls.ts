import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity } from "@dojoengine/recs";
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

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Position, Player, GameSession }: ClientComponents
) {
  const spawn = async (signer: Account, username: string, gameId: bigint) => {
    const encodedUsername: string = shortString.encodeShortString(username);
    const timestamp = Date.now();
    const entityId = getEntityIdFromKeys([BigInt(signer.address)]) as Entity;
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: entityId,
      value: { gameId: gameId },
    });

    try {
      const { transaction_hash } = await execute(signer, "actions", "spawn", [
        timestamp,
        encodedUsername,
        gameId,
      ]);

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await signer.waitForTransaction(transaction_hash, {
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
    console.log("startMatch called");
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
      console.log("receipt", receipt);
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

  // const move = async (signer: Account, direction: Direction) => {
  //     const entityId = getEntityIdFromKeys([
  //         BigInt(signer.address),
  //     ]) as Entity;

  //     const positionId = uuid();
  //     Position.addOverride(positionId, {
  //         entity: entityId,
  //         value: {
  //             player: BigInt(entityId),
  //             vec: updatePositionWithDirection(
  //                 direction,
  //                 getComponentValue(Position, entityId) as any
  //             ).vec,
  //         },
  //     });

  //     const movesId = uuid();
  //     Moves.addOverride(movesId, {
  //         entity: entityId,
  //         value: {
  //             player: BigInt(entityId),
  //             remaining:
  //                 (getComponentValue(Moves, entityId)?.remaining || 0) - 1,
  //         },
  //     });

  //     try {
  //         const { transaction_hash } = await execute(
  //             signer,
  //             "actions",
  //             "move",
  //             [direction]
  //         );

  //         setComponentsFromEvents(
  //             contractComponents,
  //             getEvents(
  //                 await signer.waitForTransaction(transaction_hash, {
  //                     retryInterval: 100,
  //                 })
  //             )
  //         );
  //     } catch (e) {
  //         console.log(e);
  //         Position.removeOverride(positionId);
  //         Moves.removeOverride(movesId);
  //     } finally {
  //         Position.removeOverride(positionId);
  //         Moves.removeOverride(movesId);
  //     }
  // };

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
    moveBy,
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
