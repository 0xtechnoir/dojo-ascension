use starknet::ContractAddress;
use debug::PrintTrait;

#[derive(Serde, Copy, Drop, Introspect)]
enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

impl DirectionIntoFelt252 of Into<Direction, felt252> {
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::None => 0,
            Direction::Left => 1,
            Direction::Right => 2,
            Direction::Up => 3,
            Direction::Down => 4,
        }
    }
}

// Constant definition for a game data key. This allows us to fetch this model using the key.
const GAME_DATA_KEY: felt252 = 'game';
// Structure for storing game data with a key, number of players, and available IDs
#[derive(Model, Copy, Drop, Serde)]
struct GameData {
    #[key]
    game: felt252, // Always 'game'
    board_width: u32,
    board_height: u32,
    claim_interval: u64,
    number_of_players: u8,
    available_ids: u256,
}


#[derive(Model, Copy, Drop, Serde)]
struct PlayerAddress {
    #[key]
    id: u8,
    player: ContractAddress,
}

#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    player: ContractAddress,
    gameId: felt252,
}

#[derive(Model, Drop, Serde)]
struct InGame {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    player: ContractAddress,
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerId {
    #[key]
    player: ContractAddress,
    id: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct Position {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    x: u8,
    y: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerAtPosition {
    #[key]
    x: u8,
    #[key]
    y: u8,
    #[key]
    game_id: felt252,
    id: u8,
}

#[derive(Model, Drop, Serde)]
struct Square {
    #[key]
    x: u8,
    #[key]
    y: u8,
    #[key]
    game_id: felt252,
    piece: PieceType,
}

#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
enum PieceType {
    Player: (),
    None: ()
}

#[derive(Model, Drop, Serde)]
struct Health {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u8,
}

#[derive(Model, Drop, Serde)]
struct Username {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: felt252,
}

#[derive(Model, Drop, Serde)]
struct ActionPoint {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u8,
}

#[derive(Model, Drop, Serde)]
struct VotingPoint {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u8,
}

#[derive(Model, Drop, Serde)]
struct LastActionPointClaim {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u64,
}

#[derive(Model, Drop, Serde)]
struct LastVotingPointClaim {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u64,
}

// #[derive(Model, Drop, Serde)]
// struct ClaimInterval {
//     #[key]
//     player: ContractAddress,
//     value: u64,
// }

#[derive(Model, Drop, Serde)]
struct Alive {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: bool,
}

#[derive(Model, Drop, Serde)]
struct Range {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    value: u8,
}

#[derive(Model, Drop, Serde)]
struct GameSession {
    #[key]
    id: felt252,
    isLive: bool,
    startTime: felt252,
    gameId: felt252,
    live_players: u8,
    players: u8,
    isWon: bool,
}

impl PrintPosition of PrintTrait<Position> {
    fn print(self: Position) {
        let y: u8 = self.y;
        let x: u8 = self.x;
        'y position: '.print();
        y.print();
        'x position: '.print();
        x.print();
    }
}
