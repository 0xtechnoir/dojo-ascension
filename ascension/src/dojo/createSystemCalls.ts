import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import {
  getEntityIdFromKeys,
  getEvents,
  setComponentsFromEvents,
} from "@dojoengine/utils";
import { RejectedTransactionReceiptResponse, RevertedTransactionReceiptResponse } from "starknet";
import type { IWorld } from "../generated/generated";
import { defineContractComponents } from "./contractComponents";
import { BigNumberish } from "starknet";
import { Direction, updatePositionWithDirection } from "../utils/index"; 

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export type ContractComponents = Awaited<
    ReturnType<typeof defineContractComponents>
>;

export function createSystemCalls(
  { client }: { client: IWorld },
  contractComponents: ContractComponents,
  { Position, Player, PlayerId }: ClientComponents
) {
  const spawn = async (account: Account, username: string, gameId: BigNumberish) => {
    const timestamp = Date.now();
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const playerId = uuid();
    // Player.addOverride(playerId, {
    //   entity: entityId,
    //   value: { gameId: BigInt(gameId) },
    // });

    try {
      const { transaction_hash } = await client.actions.spawn({
        account, timestamp, username, gameId
      });

      setComponentsFromEvents(
        contractComponents,
        getEvents(
          await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          })
        )
      );
    } catch (e) {
      console.log("Error Caught in Spawn Function: ", e);
      // Player.removeOverride(playerId);
    } finally {
      // Player.removeOverride(playerId);
    }
  };

  const startMatch = async (
    account: Account,
    gameId: number,
    playersSpawned: number,
    ) => {
    let tx;
    let receipt;
    const startTime = BigInt(Date.now());
    try {
      tx = await client.actions.startMatch({
        account, gameId, playersSpawned, startTime
      });
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
    gameId: number,
    dir: Direction,
  ) => {
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;
    const playerId = getComponentValue(PlayerId, entityId)?.id;
    const posEntity = getEntityIdFromKeys([
      BigInt(playerId?.toString() || "0"),
      gameId ? BigInt(gameId) : BigInt(0),
    ]);
    const position = getComponentValue(Position, posEntity);
    const new_position = updatePositionWithDirection(
      dir,
      position || { x: 0, y: 0 }
    );

    if (!position) {
      console.warn("cannot move without a player position, not yet spawned?");
      return;
    }

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: posEntity,
      value: {
        id: playerId,
        game_id: BigInt(gameId),
        x: 8,
        y: 8
      },
    });

    let tx, receipt;
    try {
      const timestamp = BigInt(Date.now());
      tx = await client.actions.move({
        account, timestamp, gameId, dir
      });
      receipt = await account!.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });
      console.log("receipt: ", receipt);  
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

  const sendActionPoint = async (account: Account, gameId: BigNumberish, recipient: number) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.sendActionPoint({
        account, timestamp, gameId, recipient
      });
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
    };
  };
  
  const vote = async (account: Account, gameId: BigNumberish, recipient_id: number) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.vote({
        account, timestamp, gameId, recipient_id
      });
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
    };
  };

  const attack = async (account: Account, gameId: BigNumberish, target_id: number) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.attack({
        account, timestamp, target_id, gameId
      });
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
    };
  };

  const increaseRange = async (account: Account, gameId: BigNumberish) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.increaseRange({
        account, timestamp, gameId
      });
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
    };
  };

  const claimActionPoint = async (account: Account, gameId: BigNumberish) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.claimActionPoint({
        account, timestamp, gameId
      });
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
    };
  };

  const claimVotingPoint = async (account: Account, gameId: BigNumberish) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.claimVotingPoint({
        account, timestamp, gameId
      });
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
    };
  };


  const leaveGame = async (account: Account, gameId: BigNumberish) => {
    const timestamp = Date.now();
    let tx, receipt;
    try {
      tx = await client.actions.leaveGame({
        account, timestamp, gameId
      });
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
    };
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
