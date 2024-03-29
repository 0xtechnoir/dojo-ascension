import React, { useState, useEffect } from "react";
import { useDojo } from "../dojo/useDojo";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { ActionButton } from "./ActionButton";
import { useGameContext } from "../hooks/GameContext";
import { Entity, Has, HasValue, getComponentValue, getComponentValueStrict } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { shortString } from "starknet";

type PlayerProps = {
  entity: Entity;
};

const flashGreen = {
  animation: "flashGreen 1s",
  "@keyframes flashGreen": {
    "0%": { backgroundColor: "green" },
    "100%": { backgroundColor: "transparent" },
  },
};

const flashRed = {
  animation: "flashRed 1s",
  "@keyframes flashRed": {
    "0%": { backgroundColor: "red" },
    "100%": { backgroundColor: "transparent" },
  },
};

export const Player: React.FC<PlayerProps> = ({ entity }) => {

  const {
    setup: {
      contractComponents: { 
        Health,
        Range,
        ActionPoint,
        VotingPoint,
        Username,
        Alive,
        LastActionPointClaim,
        LastVotingPointClaim,
        GameSession,
        InGame,
        GameData,
        PlayerAddress,
      },
      systemCalls: {
        sendActionPoint,
        attack,
        increaseRange,
        claimActionPoint,
        vote,
        claimVotingPoint,
      },
    },
    account: { 
      account, 
    },
  } = useDojo();

  const { gameId, highlightedPlayer, setHighlightedPlayer } = useGameContext();

  const playerId = getComponentValue(InGame, entity)?.id;
  // create an entity key for the client player
  const playerEntity = useEntityQuery([
    HasValue(PlayerAddress, { player: BigInt(account.address)}),
  ]);
  

  const username = useComponentValue(Username, entity)?.value?.toString() || "";
  const health = useComponentValue(Health, entity)?.value || 0;
  const range = useComponentValue(Range, entity)?.value || 0;
  const ap = useComponentValue(ActionPoint, entity)?.value || 0;
  const vp = useComponentValue(VotingPoint, entity)?.value || 0;
  const componentPlayerIsAlive = useComponentValue(Alive, entity)?.value || false;
  const clientPlayerIsAlive = useComponentValue(Alive, playerEntity[0])?.value || false;

  // State variables to track previous values
  const [prevHealth, setPrevHealth] = useState(health);
  const [prevRange, setPrevRange] = useState(range);
  const [prevAP, setPrevAP] = useState(ap);
  const [prevVP, setPrevVP] = useState(vp);

  // State variables to track whether to show flash animation
  const [showHealthFlash, setShowHealthFlash] = useState(false);
  const [showRangeFlash, setShowRangeFlash] = useState(false);
  const [showAPFlash, setShowAPFlash] = useState(false);
  const [showVPFlash, setShowVPFlash] = useState(false);

  useEffect(() => {
    if (health !== prevHealth) {
      setShowHealthFlash(true);
    }
    if (range !== prevRange) {
      setShowRangeFlash(true);
    }
    if (ap !== prevAP) {
      setShowAPFlash(true);
    }
    if (vp !== prevVP) {
      setShowVPFlash(true);
    }
    // Reset flash states after 1 second
    const timeoutId = setTimeout(() => {
      setShowHealthFlash(false);
      setShowRangeFlash(false);
      setShowAPFlash(false);
      setShowVPFlash(false);
      setPrevHealth(health);
      setPrevRange(range);
      setPrevAP(ap);
      setPrevVP(vp);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [health, range, ap, vp]);

  // is the game live yet?
  const gameSessions = useEntityQuery([Has(GameSession)]);
  let gameIsLive = false;
  if (gameSessions) {
    // loop through gameSessions and find the one with the matching gameId
    for (let i = 0; i < gameSessions.length; i++) {
      const gameSession = gameSessions[i];
      const rec = getComponentValue(GameSession, gameSession);
      if (rec && rec.gameId === BigInt(gameId!)) {
        gameIsLive = rec?.isLive || false;
      }
    }
  }

  // create entity key from the Game_Data_Key
  const gameDataEntity = useEntityQuery([Has(GameData)]);
  const claimInterval = getComponentValue(GameData, gameDataEntity[0])?.claim_interval;
  const lastActionPointClaim = getComponentValue(LastActionPointClaim, entity)?.value;
  const lastVotingPointClaim = getComponentValue(LastVotingPointClaim, entity)?.value;
  const [timeUntilNextAPClaim, setTimeUntilNextAPClaim] = useState<string>("Calculating...");
  const [timeUntilNextVPClaim, setTimeUntilNextVPClaim] = useState<string>("Calculating...");
  
  useEffect(() => {
    const updateTimer = (
      lastClaimTimestamp: number,
      setTimeFunc: React.Dispatch<React.SetStateAction<string>>
      ) => {
        const lastClaim = new Date(lastClaimTimestamp);
        const interval = Number(claimInterval);
        const nextClaimDate = new Date(lastClaim.getTime() + interval);  
        const now = new Date();
        const timeLeft = nextClaimDate.getTime() - now.getTime();
      if (timeLeft > 0) {
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        setTimeFunc(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeFunc("Now!");
      }
    };

    const intervalId = setInterval(() => {
      updateTimer(lastActionPointClaim!, setTimeUntilNextAPClaim);
      updateTimer(lastVotingPointClaim!, setTimeUntilNextVPClaim);
    }, 1000);

    // Update the timer immediately
    updateTimer(lastActionPointClaim!, setTimeUntilNextAPClaim);
    updateTimer(lastVotingPointClaim!, setTimeUntilNextVPClaim);

    return () => clearInterval(intervalId);
  }, [lastActionPointClaim, 
    lastVotingPointClaim, 
    claimInterval]);

  if (entity === playerEntity[0]) {
    // if this is your player
    return (
      <>
        <div
          key={entity}
          className={`p-2 cursor-pointer border border-gray-400 rounded-md m-1 ${
            entity === playerEntity[0]
              ? "bg-green-900"
              : entity === highlightedPlayer
              ? "bg-gray-900"
              : ""
          }`}
          onClick={() => setHighlightedPlayer(entity)}
        >
          <p>
            Name: {shortString.decodeShortString(username)} (You {componentPlayerIsAlive ? "🚀" : "💀"})
          </p>
          <p>Status: {componentPlayerIsAlive ? `Alive` : `Dead`}</p>
          {componentPlayerIsAlive ? (
            <>
              <p
                className={`Health: ${health} ${
                  showHealthFlash
                    ? health > prevHealth
                      ? "animate-flashGreen"
                      : "animate-flashRed"
                    : ""
                }`}
              >
                Health: {health}
              </p>
              <p
                className={`Range: ${range} ${
                  showRangeFlash
                    ? range > prevRange
                      ? "animate-flashGreen"
                      : "animate-flashRed"
                    : ""
                }`}
              >
                Range: {range}
              </p>
              <p
                className={`Action Points: ${ap} ${
                  showAPFlash
                    ? ap > prevAP
                      ? "animate-flashGreen"
                      : "animate-flashRed"
                    : ""
                }`}
              >
                Action Points: {ap}
              </p>
            </>
          ) : (
            <p
              className={`Voting Points: ${vp} ${
                showVPFlash
                  ? vp > prevVP
                    ? "animate-flashGreen"
                    : "animate-flashRed"
                  : ""
              }`}
            >
              Voting Points: {vp}
            </p>
          )}
          {gameIsLive &&
            (clientPlayerIsAlive ? (
              <>
                <ActionButton
                  label="Boost Range"
                  action={() => () => increaseRange(account, gameId!)}
                  buttonStyle="btn-sci-fi"
                />
                <ActionButton
                  label={`Claim AP: ${timeUntilNextAPClaim}`}
                  action={() => () => claimActionPoint(account, gameId!)}
                  buttonStyle={
                    timeUntilNextAPClaim === "Now!" ? "btn-cta" : "btn-sci-fi"
                  }
                />
              </>
            ) : (
              <>
                <ActionButton
                  label={`Claim VP: ${timeUntilNextVPClaim}`}
                  action={() => () => claimVotingPoint(account, gameId!)}
                  buttonStyle={
                    timeUntilNextVPClaim === "Now!" ? "btn-cta" : "btn-sci-fi"
                  }
                />
              </>
            ))}
        </div>
      </>
    );
  } else {
    return (
      // other players
      <div
        key={entity}
        className={`p-2 cursor-pointer border border-gray-400 rounded-md m-1 ${
          !componentPlayerIsAlive
            ? "bg-red-900"
            : entity === highlightedPlayer
            ? "bg-gray-600"
            : ""
        }`}
        onClick={() => setHighlightedPlayer(entity)}
      >
        <p>Name: {shortString.decodeShortString(username)} 🛸</p>
        <p>Status: {componentPlayerIsAlive ? `Alive` : `Dead`}</p>
        {componentPlayerIsAlive ? (
          <>
            <p
              className={`Health: ${health} ${
                showHealthFlash
                  ? health > prevHealth
                    ? "animate-flashGreen"
                    : "animate-flashRed"
                  : ""
              }`}
            >
              Health: {health}
            </p>
            <p
              className={`Range: ${range} ${
                showRangeFlash
                  ? range > prevRange
                    ? "animate-flashGreen"
                    : "animate-flashRed"
                  : ""
              }`}
            >
              Range: {range}
            </p>
            <p
              className={`Action Points: ${ap} ${
                showAPFlash
                  ? ap > prevAP
                    ? "animate-flashGreen"
                    : "animate-flashRed"
                  : ""
              }`}
            >
              Action Points: {ap}
            </p>
            <div className="flex">
              {gameIsLive && (
                <>
                  {clientPlayerIsAlive && componentPlayerIsAlive && (
                    <>
                      <ActionButton
                        label="Send AP"
                        action={() => () => sendActionPoint(account, gameId!, playerId!)}
                        buttonStyle="btn-sci-fi"
                      />
                      <ActionButton
                        label="Attack"
                        action={() => () => attack(account, gameId!, playerId!)}
                        buttonStyle="btn-sci-fi"
                      />
                    </>
                  )}
                  {!clientPlayerIsAlive && componentPlayerIsAlive && (
                    <ActionButton
                      label="Vote"
                      action={() => () => vote(account, gameId!, playerId!)}
                      buttonStyle="btn-sci-fi"
                    />
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <p
            className={`Voting Points: ${vp} ${
              showVPFlash
                ? vp > prevVP
                  ? "animate-flashGreen"
                  : "animate-flashRed"
                : ""
            }`}
          >
            Voting Points: {vp}
          </p>
        )}
      </div>
    );
  }
};
