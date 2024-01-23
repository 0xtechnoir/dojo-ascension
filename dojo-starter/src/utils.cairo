use dojo_examples::models::{Position, Direction};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

fn next_position(mut position: Position, direction: Direction) -> Position {
    match direction {
        Direction::None => { return position; },
        Direction::Left => { position.vec.x -= 1; },
        Direction::Right => { position.vec.x += 1; },
        Direction::Up => { position.vec.y -= 1; },
        Direction::Down => { position.vec.y += 1; },
    };
    position
}

// // @dev: 
// // 1. Assigns player id
// // 2. Sets player address
// // 3. Sets player id
// fn assign_player_id(world: IWorldDispatcher, num_players: u8, player: ContractAddress) -> u8 {
//     let id = num_players;
//     set!(world, (PlayerID { player, id }, PlayerAddress { player, id }));
//     id
// }