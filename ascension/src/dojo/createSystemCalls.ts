import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, HasValue, getEntitiesWithValue, getComponentValue } from "@dojoengine/recs";
import { useEntityQuery } from "@dojoengine/react";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "../utils";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { shortString } from "starknet";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Position, Moves, Player, GameSession }: ClientComponents
) { 

    // const createGameSession = async (signer: Account, gameId: number, timestamp: number) => {
    //     try {
    //         const { transaction_hash } = await execute(
    //             signer,
    //             "actions",
    //             "spawn_game",
    //             [gameId, timestamp]
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
    //     }
    // }

    const spawn = async (signer: Account, username: string, gameId: number) => {
        // console.log("signer", signer);
        // console.log('username', username);
        // console.log('gameId', gameId);
        const encodedUsername: string = shortString.encodeShortString(username);
        const timestamp = Date.now();
        const entityId = getEntityIdFromKeys([
            BigInt(signer.address),
        ]) as Entity;

        const playerId = uuid();
        Player.addOverride(playerId, {
        entity: entityId,
        value: { gameId: BigInt(gameId) },
        });

        // console.log("signer", signer);

        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "spawn",
                // [timestamp, encodedUsername, gameId]
                []
            );

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

    // const spawn = async (username: String, gameId: number) => {
    //     console.log("spawn");
    // }

    const moveBy = async (deltaX: number, deltaY: number, gameId: number) => {
        console.log("moveBy");
    }

    const startMatch = async (
        gameId: number,
        playersSpawned: number,
        startTime: number
      ) => {
        console.log("startMatch called");
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
        startMatch,
    };
}
