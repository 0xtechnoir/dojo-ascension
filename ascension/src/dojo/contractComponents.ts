/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";
import { PlayerSpawned, GameStarted } from "../events/customEvents";

export function defineContractComponents(world: World) {
  return {
	  ActionPoint: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "ActionPoint",
	          types: ["contractaddress","u8"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Alive: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Boolean },
	      {
	        metadata: {
	          name: "Alive",
	          types: ["contractaddress","bool"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  ClaimInterval: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "ClaimInterval",
	          types: ["contractaddress","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  GameSession: (() => {
	    return defineComponent(
	      world,
	      { id: RecsType.BigInt, isLive: RecsType.Boolean, startTime: RecsType.BigInt, gameId: RecsType.BigInt, players: RecsType.Number, isWon: RecsType.Boolean },
	      {
	        metadata: {
	          name: "GameSession",
	          types: ["felt252","bool","felt252","felt252","u8","bool"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Health: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "Health",
	          types: ["contractaddress","u8"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  InGame: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, gameId: RecsType.BigInt },
	      {
	        metadata: {
	          name: "InGame",
	          types: ["contractaddress","felt252"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  LastActionPointClaim: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "LastActionPointClaim",
	          types: ["contractaddress","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  LastVotingPointClaim: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "LastVotingPointClaim",
	          types: ["contractaddress","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Moves: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, remaining: RecsType.Number, last_direction: RecsType.Number },
	      {
	        metadata: {
	          name: "Moves",
	          types: ["contractaddress","u8","enum"],
	          customTypes: ["Direction"],
	        },
	      }
	    );
	  })(),
	  Player: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, gameId: RecsType.BigInt },
	      {
	        metadata: {
	          name: "Player",
	          types: ["contractaddress","felt252"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Position: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, game_id: RecsType.BigInt, vec: { x: RecsType.Number, y: RecsType.Number } },
	      {
	        metadata: {
	          name: "Position",
	          types: ["contractaddress","felt252","u32","u32"],
	          customTypes: ["Vec2"],
	        },
	      }
	    );
	  })(),
	  Range: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "Range",
	          types: ["contractaddress","u32"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  Square: (() => {
	    return defineComponent(
	      world,
	      { game_id: RecsType.BigInt, vec: { x: RecsType.Number, y: RecsType.Number }, piece: RecsType.Number },
	      {
	        metadata: {
	          name: "Square",
	          types: ["felt252","u32","u32","enum"],
	          customTypes: ["Vec2","PieceType"],
	        },
	      }
	    );
	  })(),
	  Username: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.BigInt },
	      {
	        metadata: {
	          name: "Username",
	          types: ["contractaddress","felt252"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  VotingPoint: (() => {
	    return defineComponent(
	      world,
	      { player: RecsType.BigInt, value: RecsType.Number },
	      {
	        metadata: {
	          name: "VotingPoint",
	          types: ["contractaddress","u8"],
	          customTypes: [],
	        },
	      }
	    );
	  })(),
	  // custom events
	  PlayerSpawned: PlayerSpawned(world),
      GameStarted: GameStarted(world),

	//   PlayerSpawned: (() => {
	//     return defineComponent(
	//       world,
	//       { timestamp: RecsType.BigInt, position: { x: RecsType.Number, y: RecsType.Number }, gameId: RecsType.BigInt, player: RecsType.String },
	//       {
	//         metadata: {
	//           name: "PlayerSpawned",
	//           types: ["felt252","u32","u32","felt252","felt252"],
	//           customTypes: ["Vec2"],
	//         },
	//       }
	//     );
	//   })(),
	//   GameStarted: (() => {
	//     return defineComponent(
	//       world,
	//       { startTime: RecsType.BigInt, gameId: RecsType.BigInt },
	//       {
	//         metadata: {
	//           name: "GameStarted",
	//           types: ["felt252","felt252"],
	//           customTypes: [],
	//         },
	//       }
	//     );
	//   })(),
  };
}
