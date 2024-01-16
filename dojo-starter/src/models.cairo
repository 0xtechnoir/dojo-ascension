use starknet::ContractAddress;

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

#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
enum PieceType {
    Player: (),
    None: ()
}

#[derive(Model, Drop, Serde)]
struct Square {
    #[key]
    game_id: felt252,
    #[key]
    vec: Vec2,
    piece: PieceType,
}

#[derive(Model, Drop, Serde)]
struct Moves {
    #[key]
    player: ContractAddress,
    remaining: u8,
    last_direction: Direction
}

#[derive(Model, Drop, Serde)]
struct Health {
    #[key]
    player: ContractAddress,
    value: u8,
}

#[derive(Model, Drop, Serde)]
struct InGame {
    #[key]
    player: ContractAddress,
    gameId: felt252,
}

#[derive(Model, Drop, Serde)]
struct ActionPoint {
    #[key]
    player: ContractAddress,
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
    player: ContractAddress,
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
struct Player {
    #[key]
    player: ContractAddress,
    gameId: felt252,
}

#[derive(Model, Drop, Serde)]
struct Alive {
    #[key]
    player: ContractAddress,
    value: bool,
}

#[derive(Model, Drop, Serde)]
struct Range {
    #[key]
    player: ContractAddress,
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

#[derive(Copy, Drop, Serde, Introspect)]
struct Vec2 {
    x: u32,
    y: u32
}

#[derive(Model, Copy, Drop, Serde)]
struct Position {
    #[key]
    player: ContractAddress,
    game_id: felt252,
    vec: Vec2,
}

trait Vec2Trait {
    fn is_zero(self: Vec2) -> bool;
    fn is_equal(self: Vec2, b: Vec2) -> bool;
}

impl Vec2Impl of Vec2Trait {
    fn is_zero(self: Vec2) -> bool {
        if self.x - self.y == 0 {
            return true;
        }
        false
    }

    fn is_equal(self: Vec2, b: Vec2) -> bool {
        self.x == b.x && self.y == b.y
    }
}

#[cfg(test)]
mod tests {
    use super::{Position, Vec2, Vec2Trait};

    #[test]
    #[available_gas(100000)]
    fn test_vec_is_zero() {
        assert(Vec2Trait::is_zero(Vec2 { x: 0, y: 0 }), 'not zero');
    }

    #[test]
    #[available_gas(100000)]
    fn test_vec_is_equal() {
        let position = Vec2 { x: 420, y: 0 };
        assert(position.is_equal(Vec2 { x: 420, y: 0 }), 'not equal');
    }
}
