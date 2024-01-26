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
    number_of_players: u8,
    available_ids: u256, // Packed u8s?
}

// Structure representing a player's ID with a ContractAddress
#[derive(Model, Copy, Drop, Serde)]
struct PlayerId {
    #[key]
    player: ContractAddress,
    id: u8,
}

// Structure linking a player's ID to their ContractAddress
#[derive(Model, Copy, Drop, Serde)]
struct PlayerAddress {
    #[key]
    id: u8,
    player: ContractAddress,
}

// Structure representing a position with an ID, and x, y coordinates
#[derive(Model, Copy, Drop, Serde)]
struct Position {
    #[key]
    id: u8,
    #[key]
    game_id: felt252,
    x: u8,
    y: u8,
}

// Structure to represent a player's position with unique keys and an ID
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
struct InGame {
    #[key]
    player: ContractAddress,
    game_id: felt252,
}

#[derive(Model, Drop, Serde)]
struct Player {
    #[key]
    player: ContractAddress,
    gameId: felt252,
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
    player: ContractAddress,
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
struct LastActionPointClaim {
    #[key]
    player: ContractAddress,
    value: u32,
}

#[derive(Model, Drop, Serde)]
struct LastVotingPointClaim {
    #[key]
    player: ContractAddress,
    value: u32,
}

#[derive(Model, Drop, Serde)]
struct ClaimInterval {
    #[key]
    player: ContractAddress,
    value: u32,
}

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
    value: u32,
}

#[derive(Model, Drop, Serde)]
struct GameSession {
    #[key]
    id: felt252,
    isLive: bool,
    startTime: felt252,
    gameId: felt252,
    players: u8,
    isWon: bool,
}

// #[derive(Copy, Drop, Serde, Introspect)]
// struct Vec2 {
//     x: u32,
//     y: u32
// }

// #[derive(Model, Copy, Drop, Serde)]
// struct Position {
//     #[key]
//     player: ContractAddress,
//     game_id: felt252,
//     vec: Vec2,
// }



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



// trait Vec2Trait {
//     fn is_zero(self: Vec2) -> bool;
//     fn is_equal(self: Vec2, b: Vec2) -> bool;
// }

// impl Vec2Impl of Vec2Trait {
//     fn is_zero(self: Vec2) -> bool {
//         if self.x - self.y == 0 {
//             return true;
//         }
//         false
//     }

//     fn is_equal(self: Vec2, b: Vec2) -> bool {
//         self.x == b.x && self.y == b.y
//     }
// }

#[cfg(test)]
mod tests {
    // use super::{Position, Vec2, Vec2Trait};

    // #[test]
    // #[available_gas(100000)]
    // fn test_vec_is_zero() {
    //     assert(Vec2Trait::is_zero(Vec2 { x: 0, y: 0 }), 'not zero');
    // }

    // #[test]
    // #[available_gas(100000)]
    // fn test_vec_is_equal() {
    //     let position = Vec2 { x: 420, y: 0 };
    //     assert(position.is_equal(Vec2 { x: 420, y: 0 }), 'not equal');
    // }
}
