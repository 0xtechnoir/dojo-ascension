# Ascension (Dojo Version)

## Note on client components
Currently there are some client components used to decode custom contract events. These have been added manually and will be overwritten when running ```bun run create-components```. This is a temporary fix. If you run this command make sure you have the components backed up.

## Running locally:
```
cd dojo-starter && sozo build
katana --disable-fee --dev --block-time 1000
sozo migrate
torii --world 0x33ac2f528bb97cc7b79148fd1756dc368be0e95d391d8c6d6473ecb60b4560e
cd ../client 
bun run dev
sh ./scripts/default_auth.sh
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

