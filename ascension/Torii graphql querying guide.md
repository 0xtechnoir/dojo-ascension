Searching For custom contract events in torii:

You can filter for event keys as shown below. The first key is the hash of the event name and the second key is the address of the actions contract.

You can get the hash of the event name using the following tool:
https://stark-utils.vercel.app/converter

Note: the tool will give you the selector hash, however there is an extra 0 (3rd digit) that needs to be removed, before being used to filter Torii. 

The below example is for PlayerSpawned. 

selector:
0x01ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618
0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618 (with extra 0 removed)

query {
    events (keys: ["0x1ef11bf16e094cf410426c94099c06ad3ae2ace8f1f55e38df02c09a1dff618", "0x152dcff993befafe5001975149d2c50bd9621da7cbaed74f68e7d5e54e65abc"], limit:10000) {
        edges {
          node {
            id
            keys
            data
          }
        }
    }
}

GameStarted: 0x301c9cb899caf0ce9b374949dbc7a3b553b144334bfd7278413a4eb81677e88
PlayerMoved: 0x132cd782aa62d9aeaf17b71256b4984aef1930fc3abb2d5b81183ee54d1f163
ActionPointClaimed: 0x338d93a35a22a7a679290da3c6aa761d8dc5e6d76c29393988931822a94904a
ActionPointSent: 0x336450c9dbe80edc71de7ca94ea864f1006faa781d8ba191dd2f3306759eda9
AttackExecuted: 0x28edb7159a81913ade44703effb727b50fbe761b237a0a42743215ca20b2350
PlayerKilled: 0x108e40ed49a9dc8b294b18c7b4a3b8c9e5f21020472e9c33eacd4bdad00b978
GameEnded: 0x269815c7349de3f698b18cc6e3078fbd85947f74a2d27c2d192efa260b954b6

Querying other Models:

check the docs to individual model schemas

Alive:

query {
	aliveModels {
    edges {
      node {
        id
        game_id
        value
        entity {id}
      }
    }
  }
}

Username: 

query {
  usernameModels{
    edges {
      node {
        id
        value
        entity{id}
      }
    }
  }
}

Health:

query {
  healthModels{
    edges {
      node {
        id
        game_id
        value
        entity{id}
      }
    }
  }
}

