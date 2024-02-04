import React from "react";
import { Player } from "./Player";
import { useDojo } from "../dojo/useDojo";
import { useEntityQuery } from "@dojoengine/react";
import { Entity, HasValue } from "@dojoengine/recs";

type PlayersListProps = {
  players: Entity[];
};

export const PlayersList: React.FC<PlayersListProps> = ({ players }) => {

  const {
    setup: {
        contractComponents: { PlayerAddress },
    },
    account: { 
      account, 
    },
  } = useDojo();

  const playerEntity = useEntityQuery([
    HasValue(PlayerAddress, { player: BigInt(account.address)}),
  ]);

  // Sort players so that your player comes first
  // entity key for each player in players is constructed from their ID and the game ID
  const sortedPlayers = [...players].sort((a, b) => {
    if (a === playerEntity[0]) return -1;
    if (b === playerEntity[0]) return 1;
    return 0;
  });

  return (
    <div className="h-full items-start p-3 rounded-md">
      <h1 className="text-2xl font-bold text-white mb-4">Players: 🛸</h1>
      <i>Click a player to highlight them on the map</i>
      {sortedPlayers.map((player) => {
        const entity = player;
        return <Player key={entity} entity={entity} />;
      })}
    </div>
  );
};
