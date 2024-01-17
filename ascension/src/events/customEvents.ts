// extraComponents.ts
import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export const PlayerSpawned = (world: World) => {
  return defineComponent(
    world,
    { timestamp: RecsType.BigInt, position: { x: RecsType.Number, y: RecsType.Number }, gameId: RecsType.BigInt, player: RecsType.String },
    {
      metadata: {
        name: "PlayerSpawned",
        types: ["felt252","u32","u32","felt252","felt252"],
        customTypes: ["Vec2"],
      },
    }
  );
};

export const GameStarted = (world: World) => {
  return defineComponent(
    world,
    { startTime: RecsType.BigInt, gameId: RecsType.BigInt },
    {
      metadata: {
        name: "GameStarted",
        types: ["felt252","felt252"],
        customTypes: [],
      },
    }
  );
};
