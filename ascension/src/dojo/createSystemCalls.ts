import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "../utils";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Position, Moves }: ClientComponents
) {
    // const spawn = async (signer: Account) => {
    //     const entityId = getEntityIdFromKeys([
    //         BigInt(signer.address),
    //     ]) as Entity;

    //     const positionId = uuid();
    //     Position.addOverride(positionId, {
    //         entity: entityId,
    //         value: { player: BigInt(entityId), vec: { x: 10, y: 10 } },
    //     });

    //     const movesId = uuid();
    //     Moves.addOverride(movesId, {
    //         entity: entityId,
    //         value: {
    //             player: BigInt(entityId),
    //             remaining: 100,
    //             last_direction: 0,
    //         },
    //     });

    //     try {
    //         const { transaction_hash } = await execute(
    //             signer,
    //             "actions",
    //             "spawn",
    //             []
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

    const spawn = async (username: String, gameId: number) => {
        console.log("spawn");
    }

    const moveBy = async (deltaX: number, deltaY: number, gameId: number) => {
        console.log("moveBy");
    }

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
    }

    const increaseRange = async (gameId: number | null) => {
        console.log("increaseRange");
    }

    const claimActionPoint = async (gameId: number | null) => {
        console.log("claimActionPoint");
    }

    const vote = async (entity: Entity, gameId: number | null) => {
        console.log("vote");
    }

    const claimVotingPoint = async (gameId: number | null) => {
        console.log("claimVotingPoint");
    }

    const leaveGame = async (gameId: number | null) => {
        console.log("leaveGame");
    }

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
    };
}
