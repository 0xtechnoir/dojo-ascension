# Ascension (Dojo Version)

Ascension is is a simple PvP game inspired by [Tank Turn Tactics](https://www.youtube.com/watch?v=aOYbR-Q_4Hs) from Australian game developer Halfbrick Studios. 

Players spawn on a grid with an initial amount of health points, action points and range. Action points can be claimed every 30 seconds and are required to move, attack and boost range. Players can also choose to donate an action point to another player instead of using it themselves. 

The objective of the game is to eliminate all other competitors, however defeated players have the power to assign extra action points to live players.

Victory in Ascension is decided by how well one can manipulate other players. Pacts can be made between players to pool action points and launch deadly strikes against others, but as this game only has one winner, at some point all pacts must be broken. Players need to think carefully about how and when they choose to betray others, as creating too many enemies will result in a player’s living rivals receiving disproportionate action points from fallen players. 

## Purpose

The purpose of this project was to build a simple game in both MUD and Dojo to see how the engines and development experience differed. The report acoomanying these builds can be found here: <insert link>

The MUD repo can be found here: https://github.com/0xtechnoir/ascension


## Running locally:
```
dojoup -v0.5.0
// terminal 1
cd dojo-starter && sozo build 
// terminal 2
katana --disable-fee --dev --block-time 1000
// terminal 1
sozo migrate
// terminal 3
torii --world 0x33ac2f528bb97cc7b79148fd1756dc368be0e95d391d8c6d6473ecb60b4560e
// terminal 1
sh ./scripts/default_auth.sh
// terminal 4
cd ../client 
bun run dev
```

### Deploying katana and torii with Slot
```
curl -L https://slot.cartridge.sh | bash
slotup
slot auth login
# For old auth credentials debug:
rm ~/Library/Application\ Support/slot/credentials.json

# Create and manage deployments
slot deployments create ascension-dojo katana

# Retrieve and save credentials
slot deployments logs ascension-dojo katana -f

# switch environments in Scarb.toml
# update urls in .env.production
# populate account_address and private_key (from deployment logs above)

# Build and migrate releases
sozo --release build
sozo --release migrate

# Set up torii and connect to the world
slot deployments create ascension-dojo torii --rpc https://api.cartridge.gg/x/ascension-dojo/katana --world 0x33ac2f528bb97cc7b79148fd1756dc368be0e95d391d8c6d6473ecb60b4560e --start-block 1

# Update authentication for the release
./scripts/default_auth.sh release
```
### Deploying client with Vercel
```
cd ascension_dojo/ascension
bun run build
cd dist
vercel
// follow prompts
```

## Temporary hack for custom contract events: 
Currently there are some client components used to decode custom contract events. As these will be overwritten every time ```bun run create-components``` is executed, they can be added at the bottom of the contractComponets.ts file.

 ```
 contractComponents.ts
 
// autogenerated contract components
...
    PlayerSpawned: (() => {
      return defineComponent(
        world,
        {
          timestamp: RecsType.BigInt,
          position: { x: RecsType.Number, y: RecsType.Number },
          gameId: RecsType.BigInt,
          player: RecsType.String,
        },
        {
          metadata: {
            name: "PlayerSpawned",
            types: ["felt252", "u32", "u32", "felt252", "felt252"],
            customTypes: ["Vec2"],
          },
        }
      );
    })(),
    GameStarted: (() => {
      return defineComponent(
        world,
        { startTime: RecsType.BigInt, gameId: RecsType.BigInt },
        {
          metadata: {
            name: "GameStarted",
            types: ["felt252", "felt252"],
            customTypes: [],
          },
        }
      );
    })(),
 ```


### Graphql:
Grpahql playground: http://0.0.0.0:8080/graphql

Example queries:

```
//retrieve all player models
query {
  playerModels {
    edges {
      node {
        player
        gameId
      }
    }
  }
}

//retrieve all position models
query {
  positionModels {
    edges {
      node {
        player
        vec {x y}
      }
    }
  }
}

```

